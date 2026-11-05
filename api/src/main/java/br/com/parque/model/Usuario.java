package br.com.parque.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome_usuario", nullable = false, length = 50)
    private String nomeUsuario;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    /** Hash BCrypt. A senha em si nunca é gravada. */
    @Column(name = "senha_hash", nullable = false, length = 100)
    private String senhaHash;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    protected Usuario() {
    }

    public Usuario(String nomeUsuario, String email, String senhaHash, LocalDateTime criadoEm) {
        this.nomeUsuario = nomeUsuario;
        this.email = email;
        this.senhaHash = senhaHash;
        this.criadoEm = criadoEm;
    }

    public Long getId() { return id; }
    public String getNomeUsuario() { return nomeUsuario; }
    public String getEmail() { return email; }
    public String getSenhaHash() { return senhaHash; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
