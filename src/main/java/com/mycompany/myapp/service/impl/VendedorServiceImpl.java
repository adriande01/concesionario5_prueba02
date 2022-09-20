package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Vendedor;
import com.mycompany.myapp.repository.VendedorRepository;
import com.mycompany.myapp.service.VendedorService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vendedor}.
 */
@Service
@Transactional
public class VendedorServiceImpl implements VendedorService {

    private final Logger log = LoggerFactory.getLogger(VendedorServiceImpl.class);

    private final VendedorRepository vendedorRepository;

    public VendedorServiceImpl(VendedorRepository vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }

    @Override
    public Vendedor save(Vendedor vendedor) {
        log.debug("Request to save Vendedor : {}", vendedor);
        return vendedorRepository.save(vendedor);
    }

    @Override
    public Vendedor update(Vendedor vendedor) {
        log.debug("Request to update Vendedor : {}", vendedor);
        return vendedorRepository.save(vendedor);
    }

    @Override
    public Optional<Vendedor> partialUpdate(Vendedor vendedor) {
        log.debug("Request to partially update Vendedor : {}", vendedor);

        return vendedorRepository
            .findById(vendedor.getId())
            .map(existingVendedor -> {
                if (vendedor.getFirstName() != null) {
                    existingVendedor.setFirstName(vendedor.getFirstName());
                }
                if (vendedor.getLastName() != null) {
                    existingVendedor.setLastName(vendedor.getLastName());
                }
                if (vendedor.getEmail() != null) {
                    existingVendedor.setEmail(vendedor.getEmail());
                }
                if (vendedor.getPhoneNumber() != null) {
                    existingVendedor.setPhoneNumber(vendedor.getPhoneNumber());
                }
                if (vendedor.getHireDate() != null) {
                    existingVendedor.setHireDate(vendedor.getHireDate());
                }
                if (vendedor.getSalary() != null) {
                    existingVendedor.setSalary(vendedor.getSalary());
                }
                if (vendedor.getCommissionPct() != null) {
                    existingVendedor.setCommissionPct(vendedor.getCommissionPct());
                }

                return existingVendedor;
            })
            .map(vendedorRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Vendedor> findAll(Pageable pageable) {
        log.debug("Request to get all Vendedors");
        return vendedorRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vendedor> findOne(Long id) {
        log.debug("Request to get Vendedor : {}", id);
        return vendedorRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vendedor : {}", id);
        vendedorRepository.deleteById(id);
    }
}
