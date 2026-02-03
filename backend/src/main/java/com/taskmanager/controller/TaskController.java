package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestHeader("Authorization") String token,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        
        try {
            String userId = taskService.extractUserIdFromToken(token);
            
            List<Task> tasks;
            if (status != null) {
                boolean completed = status.equalsIgnoreCase("completed");
                tasks = taskService.getTasksByStatus(userId, completed);
            } else if (priority != null) {
                tasks = taskService.getTasksByPriority(userId, priority);
            } else {
                tasks = taskService.getAllTasks(userId);
            }
            
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createTask(
            @Valid @RequestBody TaskRequest request,
            @RequestHeader("Authorization") String token) {
        
        try {
            String userId = taskService.extractUserIdFromToken(token);
            Task task = taskService.createTask(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable String id,
            @Valid @RequestBody TaskRequest request,
            @RequestHeader("Authorization") String token) {
        
        try {
            String userId = taskService.extractUserIdFromToken(token);
            Task task = taskService.updateTask(id, request, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleTaskStatus(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        
        try {
            String userId = taskService.extractUserIdFromToken(token);
            Task task = taskService.toggleTaskStatus(id, userId);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        
        try {
            String userId = taskService.extractUserIdFromToken(token);
            taskService.deleteTask(id, userId);
            return ResponseEntity.ok().body("Task deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
