package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Vehiculo;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Vehiculo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    // JPA query
    List<Vehiculo> findAllByVentaIsNullAndReservadoFalse();

    // JPQL query

    /*  @Query("SELECT v FROM Vehiculo v WHERE v.venta IS NOT NULL AND v.reservado = :res") // v.reservado = TRUE
    Page<Vehiculo> findVehiculosNoDisponibles(@Param("res") String res); // boolean res
    */
    @Query("SELECT v FROM Vehiculo v WHERE v.venta IS NOT NULL OR v.reservado = TRUE")
    List<Vehiculo> findVehiculosNoDisponibles();
}
