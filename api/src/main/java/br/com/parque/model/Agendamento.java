package br.com.parque.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

// A restrição única garante, no próprio banco, que o mesmo lugar não seja
// agendado duas vezes no mesmo dia e hora (mesmo com duas requisições simultâneas).
@Entity
@Table(
        name = "agendamentos",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_agendamento_lugar_data_hora",
                columnNames = {"lugar_id", "data_agendamento", "hora_agendamento"}))
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lugar_id", nullable = false)
    private Lugar lugar;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "data_agendamento", nullable = false)
    private LocalDate data;

    @Column(name = "hora_agendamento", nullable = false)
    private LocalTime hora;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    protected Agendamento() {
    }

    public Agendamento(Lugar lugar, Usuario usuario, LocalDate data, LocalTime hora, LocalDateTime criadoEm) {
        this.lugar = lugar;
        this.usuario = usuario;
        this.data = data;
        this.hora = hora;
        this.criadoEm = criadoEm;
    }

    public Long getId() { return id; }
    public Lugar getLugar() { return lugar; }
    public Usuario getUsuario() { return usuario; }
    public LocalDate getData() { return data; }
    public LocalTime getHora() { return hora; }
    public LocalDateTime getCriadoEm() { return criadoEm; }
}
