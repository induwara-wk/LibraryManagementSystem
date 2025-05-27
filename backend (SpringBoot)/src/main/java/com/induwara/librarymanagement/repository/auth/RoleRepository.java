package com.induwara.librarymanagement.repository;

import com.induwara.librarymanagement.model.auth.ERole;
import com.induwara.librarymanagement.model.auth.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
} 