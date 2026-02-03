package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {
    
    private static final Logger logger = LoggerFactory.getLogger(TaskService.class);
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public String extractUserIdFromToken(String token) {
        return jwtUtil.extractUserId(token.substring(7));
    }
    
    public List<Task> getAllTasks(String userId) {
        logger.info("Fetching all tasks for user: {}", userId);
        return taskRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Task> getTasksByStatus(String userId, boolean completed) {
        logger.info("Fetching {} tasks for user: {}", completed ? "completed" : "pending", userId);
        return taskRepository.findByUserIdAndCompleted(userId, completed);
    }
    
    public List<Task> getTasksByPriority(String userId, String priority) {
        logger.info("Fetching {} priority tasks for user: {}", priority, userId);
        return taskRepository.findByUserIdAndPriority(userId, priority.toUpperCase());
    }
    
    public Task createTask(TaskRequest request, String userId) {
        logger.info("Creating new task for user: {}", userId);
        
        Task task = new Task(
            request.getTitle(),
            request.getDescription(),
            request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM",
            userId
        );
        
        task = taskRepository.save(task);
        logger.info("Task created successfully with ID: {}", task.getId());
        
        return task;
    }
    
    public Task updateTask(String taskId, TaskRequest request, String userId) {
        logger.info("Updating task: {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getUserId().equals(userId)) {
            logger.warn("Unauthorized update attempt for task: {} by user: {}", taskId, userId);
            throw new RuntimeException("Unauthorized");
        }
        
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority().toUpperCase() : task.getPriority());
        
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }
        
        task.setUpdatedAt(LocalDateTime.now());
        
        task = taskRepository.save(task);
        logger.info("Task updated successfully: {}", taskId);
        
        return task;
    }
    
    public void deleteTask(String taskId, String userId) {
        logger.info("Deleting task: {} for user: {}", taskId, userId);
        
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getUserId().equals(userId)) {
            logger.warn("Unauthorized delete attempt for task: {} by user: {}", taskId, userId);
            throw new RuntimeException("Unauthorized");
        }
        
        taskRepository.deleteById(taskId);
        logger.info("Task deleted successfully: {}", taskId);
    }
    
    public Task toggleTaskStatus(String taskId, String userId) {
        logger.info("Toggling status for task: {}", taskId);
        
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!task.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        task.setCompleted(!task.isCompleted());
        task.setUpdatedAt(LocalDateTime.now());
        
        return taskRepository.save(task);
    }
}
