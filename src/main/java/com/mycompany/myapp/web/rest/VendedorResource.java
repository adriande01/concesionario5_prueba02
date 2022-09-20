package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Vendedor;
import com.mycompany.myapp.repository.VendedorRepository;
import com.mycompany.myapp.service.VendedorService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Vendedor}.
 */
@RestController
@RequestMapping("/api")
public class VendedorResource {

    private final Logger log = LoggerFactory.getLogger(VendedorResource.class);

    private static final String ENTITY_NAME = "vendedor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VendedorService vendedorService;

    private final VendedorRepository vendedorRepository;

    public VendedorResource(VendedorService vendedorService, VendedorRepository vendedorRepository) {
        this.vendedorService = vendedorService;
        this.vendedorRepository = vendedorRepository;
    }

    /**
     * {@code POST  /vendedors} : Create a new vendedor.
     *
     * @param vendedor the vendedor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vendedor, or with status {@code 400 (Bad Request)} if the vendedor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vendedors")
    public ResponseEntity<Vendedor> createVendedor(@Valid @RequestBody Vendedor vendedor) throws URISyntaxException {
        log.debug("REST request to save Vendedor : {}", vendedor);
        if (vendedor.getId() != null) {
            throw new BadRequestAlertException("A new vendedor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vendedor result = vendedorService.save(vendedor);
        return ResponseEntity
            .created(new URI("/api/vendedors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vendedors/:id} : Updates an existing vendedor.
     *
     * @param id the id of the vendedor to save.
     * @param vendedor the vendedor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vendedor,
     * or with status {@code 400 (Bad Request)} if the vendedor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vendedor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vendedors/{id}")
    public ResponseEntity<Vendedor> updateVendedor(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Vendedor vendedor
    ) throws URISyntaxException {
        log.debug("REST request to update Vendedor : {}, {}", id, vendedor);
        if (vendedor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vendedor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vendedorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vendedor result = vendedorService.update(vendedor);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vendedor.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vendedors/:id} : Partial updates given fields of an existing vendedor, field will ignore if it is null
     *
     * @param id the id of the vendedor to save.
     * @param vendedor the vendedor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vendedor,
     * or with status {@code 400 (Bad Request)} if the vendedor is not valid,
     * or with status {@code 404 (Not Found)} if the vendedor is not found,
     * or with status {@code 500 (Internal Server Error)} if the vendedor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vendedors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vendedor> partialUpdateVendedor(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Vendedor vendedor
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vendedor partially : {}, {}", id, vendedor);
        if (vendedor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vendedor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vendedorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vendedor> result = vendedorService.partialUpdate(vendedor);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vendedor.getId().toString())
        );
    }

    /**
     * {@code GET  /vendedors} : get all the vendedors.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vendedors in body.
     */
    @GetMapping("/vendedors")
    public ResponseEntity<List<Vendedor>> getAllVendedors(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Vendedors");
        Page<Vendedor> page = vendedorService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /vendedors/:id} : get the "id" vendedor.
     *
     * @param id the id of the vendedor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vendedor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vendedors/{id}")
    public ResponseEntity<Vendedor> getVendedor(@PathVariable Long id) {
        log.debug("REST request to get Vendedor : {}", id);
        Optional<Vendedor> vendedor = vendedorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vendedor);
    }

    /**
     * {@code DELETE  /vendedors/:id} : delete the "id" vendedor.
     *
     * @param id the id of the vendedor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vendedors/{id}")
    public ResponseEntity<Void> deleteVendedor(@PathVariable Long id) {
        log.debug("REST request to delete Vendedor : {}", id);
        vendedorService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
