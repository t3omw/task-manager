import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Modal, Badge, Row, Col, Alert } from 'react-bootstrap';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const { user, logout } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const fetchTasks = async () => {
        try {
            let response;
            if (filter === 'all') {
                response = await taskAPI.getAllTasks();
            } else if (filter === 'completed' || filter === 'pending') {
                response = await taskAPI.getTasksByStatus(filter);
            } else {
                response = await taskAPI.getTasksByPriority(filter);
            }
            setTasks(response.data);
        } catch (err) {
            setError('Failed to fetch tasks');
        }
    };

    const handleOpenModal = (task = null) => {
        if (task) {
            setEditingTask(task);
            setFormData({
                title: task.title,
                description: task.description,
                priority: task.priority
            });
        } else {
            setEditingTask(null);
            setFormData({
                title: '',
                description: '',
                priority: 'MEDIUM'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTask(null);
        setFormData({
            title: '',
            description: '',
            priority: 'MEDIUM'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await taskAPI.updateTask(editingTask.id, formData);
            } else {
                await taskAPI.createTask(formData);
            }
            fetchTasks();
            handleCloseModal();
        } catch (err) {
            setError('Failed to save task');
        }
    };

    const handleToggle = async (id) => {
        try {
            await taskAPI.toggleTask(id);
            fetchTasks();
        } catch (err) {
            setError('Failed to toggle task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.deleteTask(id);
                fetchTasks();
            } catch (err) {
                setError('Failed to delete task');
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'danger';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'info';
            default: return 'secondary';
        }
    };

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Task Manager</h1>
                <div>
                    <span className="me-3">Welcome, {user?.username}!</span>
                    <Button variant="outline-danger" onClick={logout}>Logout</Button>
                </div>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

            <Row className="mb-4">
                <Col md={8}>
                    <div className="d-flex gap-2">
                        <Button 
                            variant={filter === 'all' ? 'primary' : 'outline-primary'}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </Button>
                        <Button 
                            variant={filter === 'pending' ? 'primary' : 'outline-primary'}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </Button>
                        <Button 
                            variant={filter === 'completed' ? 'primary' : 'outline-primary'}
                            onClick={() => setFilter('completed')}
                        >
                            Completed
                        </Button>
                        <Button 
                            variant={filter === 'HIGH' ? 'danger' : 'outline-danger'}
                            onClick={() => setFilter('HIGH')}
                        >
                            High Priority
                        </Button>
                        <Button 
                            variant={filter === 'MEDIUM' ? 'warning' : 'outline-warning'}
                            onClick={() => setFilter('MEDIUM')}
                        >
                            Medium Priority
                        </Button>
                        <Button 
                            variant={filter === 'LOW' ? 'info' : 'outline-info'}
                            onClick={() => setFilter('LOW')}
                        >
                            Low Priority
                        </Button>
                    </div>
                </Col>
                <Col md={4} className="text-end">
                    <Button variant="success" onClick={() => handleOpenModal()}>
                        + Add New Task
                    </Button>
                </Col>
            </Row>

            <Row>
                {tasks.length === 0 ? (
                    <Col>
                        <Alert variant="info">No tasks found. Create your first task!</Alert>
                    </Col>
                ) : (
                    tasks.map((task) => (
                        <Col md={6} lg={4} key={task.id} className="mb-3">
                            <Card className={`h-100 ${task.completed ? 'border-success' : ''}`}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className={task.completed ? 'text-decoration-line-through' : ''}>
                                            {task.title}
                                        </h5>
                                        <Badge bg={getPriorityColor(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <Card.Text className={task.completed ? 'text-muted' : ''}>
                                        {task.description || 'No description'}
                                    </Card.Text>
                                    <div className="d-flex gap-2 mt-3">
                                        <Button 
                                            size="sm" 
                                            variant={task.completed ? 'warning' : 'success'}
                                            onClick={() => handleToggle(task.id)}
                                        >
                                            {task.completed ? 'Undo' : 'Complete'}
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="primary"
                                            onClick={() => handleOpenModal(task)}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="danger"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Add/Edit Task Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                                placeholder="Enter task title"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Enter task description"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingTask ? 'Update Task' : 'Add Task'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default TaskList;
