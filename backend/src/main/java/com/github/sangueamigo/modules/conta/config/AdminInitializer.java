package com.github.sangueamigo.modules.conta.config;

import com.github.sangueamigo.modules.administrador.entity.Administrador;
import com.github.sangueamigo.modules.administrador.repository.AdministradorRepository;
import com.github.sangueamigo.modules.conta.entity.Conta;
import com.github.sangueamigo.modules.conta.enums.Role;
import com.github.sangueamigo.modules.conta.repository.ContaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final ContaRepository contaRepository;
    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@sangueamigo.local}")
    private String adminEmail;

    @Value("${app.admin.password:Admin123!}")
    private String adminPassword;

    @Value("${app.admin.name:Administrador}")
    private String adminName;

    @Value("${app.admin.role-name:Gestor}")
    private String adminRoleName;

    @Value("${app.admin.phone:}")
    private String adminPhone;

    @Override
    @Transactional
    public void run(String... args) {
        Conta conta = contaRepository.findByEmail(adminEmail)
                .orElseGet(this::criarContaAdmin);

        if (conta.getRole() != Role.ROLE_ADMIN) {
            throw new IllegalStateException("O e-mail configurado para o admin pertence a outra funcao.");
        }

        if (!administradorRepository.existsByContaId(conta.getId())) {
            criarPerfilAdmin(conta);
        }
    }

    private Conta criarContaAdmin() {
        Conta admin = new Conta();
        admin.setEmail(adminEmail);
        admin.setSenha(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ROLE_ADMIN);
        return contaRepository.save(admin);
    }

    private void criarPerfilAdmin(Conta conta) {
        Administrador administrador = new Administrador();
        administrador.setNome(adminName);
        administrador.setTelefone(adminPhone);
        administrador.setCargo(adminRoleName);
        administrador.setConta(conta);
        administradorRepository.save(administrador);
    }
}
