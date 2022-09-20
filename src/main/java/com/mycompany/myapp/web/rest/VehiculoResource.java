package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Vehiculo;
import com.mycompany.myapp.repository.VehiculoRepository;
import com.mycompany.myapp.service.VehiculoService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Vehiculo}.
 */
@RestController
@RequestMapping("/api")
public class VehiculoResource {

    private final Logger log = LoggerFactory.getLogger(VehiculoResource.class);

    private static final String ENTITY_NAME = "vehiculo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VehiculoService vehiculoService;

    private final VehiculoRepository vehiculoRepository;

    public VehiculoResource(VehiculoService vehiculoService, VehiculoRepository vehiculoRepository) {
        this.vehiculoService = vehiculoService;
        this.vehiculoRepository = vehiculoRepository;
    }

    /**
     * {@code POST  /vehiculos} : Create a new vehiculo.
     *
     * @param vehiculo the vehiculo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new vehiculo, or with status {@code 400 (Bad Request)} if the vehiculo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/vehiculos")
    public ResponseEntity<Vehiculo> createVehiculo(@Valid @RequestBody Vehiculo vehiculo) throws URISyntaxException {
        log.debug("REST request to save Vehiculo : {}", vehiculo);
        if (vehiculo.getId() != null) {
            throw new BadRequestAlertException("A new vehiculo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Vehiculo result = vehiculoService.save(vehiculo);
        return ResponseEntity
            .created(new URI("/api/vehiculos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /vehiculos/:id} : Updates an existing vehiculo.
     *
     * @param id the id of the vehiculo to save.
     * @param vehiculo the vehiculo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehiculo,
     * or with status {@code 400 (Bad Request)} if the vehiculo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the vehiculo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/vehiculos/{id}")
    public ResponseEntity<Vehiculo> updateVehiculo(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Vehiculo vehiculo
    ) throws URISyntaxException {
        log.debug("REST request to update Vehiculo : {}, {}", id, vehiculo);
        if (vehiculo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehiculo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehiculoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Vehiculo result = vehiculoService.update(vehiculo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehiculo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /vehiculos/:id} : Partial updates given fields of an existing vehiculo, field will ignore if it is null
     *
     * @param id the id of the vehiculo to save.
     * @param vehiculo the vehiculo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated vehiculo,
     * or with status {@code 400 (Bad Request)} if the vehiculo is not valid,
     * or with status {@code 404 (Not Found)} if the vehiculo is not found,
     * or with status {@code 500 (Internal Server Error)} if the vehiculo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/vehiculos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Vehiculo> partialUpdateVehiculo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Vehiculo vehiculo
    ) throws URISyntaxException {
        log.debug("REST request to partial update Vehiculo partially : {}, {}", id, vehiculo);
        if (vehiculo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, vehiculo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!vehiculoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Vehiculo> result = vehiculoService.partialUpdate(vehiculo);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, vehiculo.getId().toString())
        );
    }

    /**
     * {@code GET  /vehiculos} : get all the vehiculos.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of vehiculos in body.
     */
    @GetMapping("/vehiculos")
    public ResponseEntity<List<Vehiculo>> getAllVehiculos(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("venta-is-null".equals(filter)) {
            log.debug("REST request to get all Vehiculos where venta is null");
            return new ResponseEntity<>(vehiculoService.findAllWhereVentaIsNull(), HttpStatus.OK);
        }
        log.debug("REST request to get a page of Vehiculos");
        Page<Vehiculo> page = vehiculoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /vehiculos/:id} : get the "id" vehiculo.
     *
     * @param id the id of the vehiculo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the vehiculo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/vehiculos/{id}")
    public ResponseEntity<Vehiculo> getVehiculo(@PathVariable Long id) {
        log.debug("REST request to get Vehiculo : {}", id);
        Optional<Vehiculo> vehiculo = vehiculoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(vehiculo);
    }

    /**
     * {@code DELETE  /vehiculos/:id} : delete the "id" vehiculo.
     *
     * @param id the id of the vehiculo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/vehiculos/{id}")
    public ResponseEntity<Void> deleteVehiculo(@PathVariable Long id) {
        log.debug("REST request to delete Vehiculo : {}", id);
        vehiculoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
