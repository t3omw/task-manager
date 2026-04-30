package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor // This automatically creates the (String token, String username, String userId) constructor
public class AuthResponse {
    private String token;
    private String username;
    private String userId;
}