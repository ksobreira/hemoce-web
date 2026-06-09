package com.github.sangueamigo.modules.administrador.entity;

import com.github.sangueamigo.modules.conta.entity.Conta;
import com.github.sangueamigo.modules.hemocentro.entity.Hemocentro;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column
    private String telefone;

    @Column(nullable = false)
    private String cargo;

    @OneToOne(optional = false)
    @JoinColumn(name = "conta_id", nullable = false, unique = true)
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hemocentro_id")
    private Hemocentro hemocentro;
}
