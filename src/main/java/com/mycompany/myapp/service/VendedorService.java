package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Vendedor;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Vendedor}.
 */
public interface VendedorService {
    /**
     * Save a vendedor.
     *
     * @param vendedor the entity to save.
     * @return the persisted entity.
     */
    Vendedor save(Vendedor vendedor);

    /**
     * Updates a vendedor.
     *
     * @param vendedor the entity to update.
     * @return the persisted entity.
     */
    Vendedor update(Vendedor vendedor);

    /**
     * Partially updates a vendedor.
     *
     * @param vendedor the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Vendedor> partialUpdate(Vendedor vendedor);

    /**
     * Get all the vendedors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Vendedor> findAll(Pageable pageable);

    /**
     * Get the "id" vendedor.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Vendedor> findOne(Long id);

    /**
     * Delete the "id" vendedor.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
