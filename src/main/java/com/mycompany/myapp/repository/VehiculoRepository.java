package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Vehiculo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vehiculo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {}
