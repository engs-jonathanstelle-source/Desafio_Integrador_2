package br.com.parque.repository;

import br.com.parque.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    List<Agendamento> findByLugarIdAndDataGreaterThanEqualOrderByDataAscHoraAsc(Long lugarId, LocalDate data);

    List<Agendamento> findByDataGreaterThanEqualOrderByDataAscHoraAsc(LocalDate data);

    boolean existsByLugarIdAndDataAndHora(Long lugarId, LocalDate data, LocalTime hora);
}
