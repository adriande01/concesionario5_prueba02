package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Vehiculo;
import com.mycompany.myapp.repository.VehiculoRepository;
import com.mycompany.myapp.service.VehiculoService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vehiculo}.
 */
@Service
@Transactional
public class VehiculoServiceImpl implements VehiculoService {

    private final Logger log = LoggerFactory.getLogger(VehiculoServiceImpl.class);

    private final VehiculoRepository vehiculoRepository;

    public VehiculoServiceImpl(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @Override
    public Vehiculo save(Vehiculo vehiculo) {
        log.debug("Request to save Vehiculo : {}", vehiculo);
        return vehiculoRepository.save(vehiculo);
    }

    @Override
    public Vehiculo update(Vehiculo vehiculo) {
        log.debug("Request to update Vehiculo : {}", vehiculo);
        return vehiculoRepository.save(vehiculo);
    }

    @Override
    public Optional<Vehiculo> partialUpdate(Vehiculo vehiculo) {
        log.debug("Request to partially update Vehiculo : {}", vehiculo);

        return vehiculoRepository
            .findById(vehiculo.getId())
            .map(existingVehiculo -> {
                if (vehiculo.getModeloName() != null) {
                    existingVehiculo.setModeloName(vehiculo.getModeloName());
                }
                if (vehiculo.getMarcaName() != null) {
                    existingVehiculo.setMarcaName(vehiculo.getMarcaName());
                }
                if (vehiculo.getPrecio() != null) {
                    existingVehiculo.setPrecio(vehiculo.getPrecio());
                }
                if (vehiculo.getTipo() != null) {
                    existingVehiculo.setTipo(vehiculo.getTipo());
                }
                if (vehiculo.getHibrido() != null) {
                    existingVehiculo.setHibrido(vehiculo.getHibrido());
                }

                return existingVehiculo;
            })
            .map(vehiculoRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vehiculo> findAll(Pageable pageable) {
        log.debug("Request to get all Vehiculos");
        return vehiculoRepository.findAll(pageable);
    }

    /**
     *  Get all the vehiculos where Venta is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Vehiculo> findAllWhereVentaIsNull() {
        log.debug("Request to get all vehiculos where Venta is null");
        return StreamSupport
            .stream(vehiculoRepository.findAll().spliterator(), false)
            .filter(vehiculo -> vehiculo.getVenta() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vehiculo> findOne(Long id) {
        log.debug("Request to get Vehiculo : {}", id);
        return vehiculoRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vehiculo : {}", id);
        vehiculoRepository.deleteById(id);
    }
}
