package com.induwara.librarymanagement.config;

import com.induwara.librarymanagement.model.ERole;
import com.induwara.librarymanagement.model.Role;
import com.induwara.librarymanagement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        // Create roles if they don't exist
        createRoleIfNotFound(ERole.ROLE_USER);
        createRoleIfNotFound(ERole.ROLE_ADMIN);

        alreadySetup = true;
    }

    private void createRoleIfNotFound(ERole name) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role(name);
            roleRepository.save(role);
        }
    }
} 