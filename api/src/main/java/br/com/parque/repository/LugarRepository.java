package br.com.parque.repository;

import br.com.parque.model.Lugar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LugarRepository extends JpaRepository<Lugar, Long> {
}
