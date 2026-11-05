package br.com.parque.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Lugar do parque. O id é fixo (não gerado) porque o app associa as fotos a cada lugar
 * pelo id (veja data/lugares.js no app).
 */
@Entity
@Table(name = "lugares")
public class Lugar {

    @Id
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @Column(nullable = false)
    private boolean agendavel;

    protected Lugar() {
    }

    public Lugar(Long id, String nome, String descricao, boolean agendavel) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.agendavel = agendavel;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public boolean isAgendavel() { return agendavel; }
}
