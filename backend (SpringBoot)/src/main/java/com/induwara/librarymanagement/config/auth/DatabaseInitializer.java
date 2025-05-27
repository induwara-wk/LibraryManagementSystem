package com.induwara.librarymanagement.config.auth;

import com.induwara.librarymanagement.model.auth.ERole;
import com.induwara.librarymanagement.model.auth.Role;
import com.induwara.librarymanagement.repository.auth.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

// Run this class automatically when the app starts
@Component
// Listen for application startup events
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false; // Check whether the roles are only created once

    private final RoleRepository roleRepository;

    @Autowired
    // Inject the instance of the 'roleRepository'
    public DatabaseInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Runs after the app started correctly
    @Override
    public void onApplicationEvent(@NonNull ContextRefreshedEvent event) {
        // If the roles are already created skip
        if (alreadySetup) {
            return;
        }

        // Check whether both roles exists
        createRoleIfNotFound(ERole.ROLE_USER);
        createRoleIfNotFound(ERole.ROLE_ADMIN);

        // Already added the roles
        alreadySetup = true;
    }

    // Check whether the role type exists in the database
    private void createRoleIfNotFound(ERole name) {
        // If the role not found
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name); // Create the non-existing role
            roleRepository.save(role); // Save it to the database
        }
    }
} 