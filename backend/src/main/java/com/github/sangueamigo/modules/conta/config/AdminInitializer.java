package com.github.sangueamigo.modules.conta.config;

import com.github.sangueamigo.modules.conta.entity.Conta;
import com.github.sangueamigo.modules.conta.enums.Role;
import com.github.sangueamigo.modules.conta.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final ContaRepository contaRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@sangueamigo.local}")
    private String adminEmail;

    @Value("${app.admin.password:Admin123!}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        if (contaRepository.existsByEmail(adminEmail)) {
            return;
        }

        Conta admin = new Conta();
        admin.setEmail(adminEmail);
        admin.setSenha(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ROLE_ADMIN);
        contaRepository.save(admin);
    }
}
