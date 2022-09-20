package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Venta;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Venta}.
 */
public interface VentaService {
    /**
     * Save a venta.
     *
     * @param venta the entity to save.
     * @return the persisted entity.
     */
    Venta save(Venta venta);

    /**
     * Updates a venta.
     *
     * @param venta the entity to update.
     * @return the persisted entity.
     */
    Venta update(Venta venta);

    /**
     * Partially updates a venta.
     *
     * @param venta the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Venta> partialUpdate(Venta venta);

    /**
     * Get all the ventas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Venta> findAll(Pageable pageable);

    /**
     * Get the "id" venta.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Venta> findOne(Long id);

    /**
     * Delete the "id" venta.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
