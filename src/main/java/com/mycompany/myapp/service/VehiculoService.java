package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Vehiculo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Vehiculo}.
 */
public interface VehiculoService {
    /**
     * Save a vehiculo.
     *
     * @param vehiculo the entity to save.
     * @return the persisted entity.
     */
    Vehiculo save(Vehiculo vehiculo);

    /**
     * Updates a vehiculo.
     *
     * @param vehiculo the entity to update.
     * @return the persisted entity.
     */
    Vehiculo update(Vehiculo vehiculo);

    /**
     * Partially updates a vehiculo.
     *
     * @param vehiculo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Vehiculo> partialUpdate(Vehiculo vehiculo);

    /**
     * Get all the vehiculos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Vehiculo> findAll(Pageable pageable);
    /**
     * Get all the Vehiculo where Venta is {@code null}.
     *
     * @return the {@link List} of entities.
     */
    List<Vehiculo> findAllWhereVentaIsNull();

    /**
     * Get the "id" vehiculo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Vehiculo> findOne(Long id);

    /**
     * Delete the "id" vehiculo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
