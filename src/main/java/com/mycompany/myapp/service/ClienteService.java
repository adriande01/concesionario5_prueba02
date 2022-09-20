package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Cliente;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Cliente}.
 */
public interface ClienteService {
    /**
     * Save a cliente.
     *
     * @param cliente the entity to save.
     * @return the persisted entity.
     */
    Cliente save(Cliente cliente);

    /**
     * Updates a cliente.
     *
     * @param cliente the entity to update.
     * @return the persisted entity.
     */
    Cliente update(Cliente cliente);

    /**
     * Partially updates a cliente.
     *
     * @param cliente the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Cliente> partialUpdate(Cliente cliente);

    /**
     * Get all the clientes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Cliente> findAll(Pageable pageable);

    /**
     * Get the "id" cliente.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Cliente> findOne(Long id);

    /**
     * Delete the "id" cliente.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
