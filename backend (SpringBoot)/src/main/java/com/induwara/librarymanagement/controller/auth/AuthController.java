package com.induwara.librarymanagement.controller.auth;

import com.induwara.librarymanagement.dto.auth.JwtResponse;
import com.induwara.librarymanagement.dto.auth.LoginRequest;
import com.induwara.librarymanagement.dto.auth.MessageResponse;
import com.induwara.librarymanagement.dto.auth.SignupRequest;
import com.induwara.librarymanagement.model.auth.ERole;
import com.induwara.librarymanagement.model.auth.Role;
import com.induwara.librarymanagement.model.auth.User;
import com.induwara.librarymanagement.repository.auth.RoleRepository;
import com.induwara.librarymanagement.repository.auth.UserRepository;
import com.induwara.librarymanagement.service.auth.jwt.JwtUtils;
import com.induwara.librarymanagement.service.auth.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200"}, maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                            UserRepository userRepository,
                            RoleRepository roleRepository,
                            PasswordEncoder encoder,
                            JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER).orElse(null);
            if (userRole == null) {
                 return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: User role not found in the database."));
            }
            roles.add(userRole);
        } else {
            for (String role : strRoles) {
                if ("admin".equals(role)) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).orElse(null);
                    if (adminRole == null) {
                        return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: Admin role not found in the database."));
                    }
                    roles.add(adminRole);

                } else {
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER).orElse(null);
                     if (userRole == null) {
                        return ResponseEntity
                            .badRequest()
                            .body(new MessageResponse("Error: User role not found in the database."));
                    }

                    roles.add(userRole);
                }
            }
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
} 