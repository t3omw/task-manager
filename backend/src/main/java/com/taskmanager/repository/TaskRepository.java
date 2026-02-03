package com.taskmanager.repository;

import com.taskmanager.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);
    List<Task> findByUserIdAndCompleted(String userId, boolean completed);
    List<Task> findByUserIdAndPriority(String userId, String priority);
    List<Task> findByUserIdOrderByCreatedAtDesc(String userId);
}
