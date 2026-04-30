package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor // Generates a constructor with all fields
@NoArgsConstructor  // Generates a default constructor
@Data
public class TaskRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    private String priority; // LOW, MEDIUM, HIGH
    
    private Boolean completed;
}
