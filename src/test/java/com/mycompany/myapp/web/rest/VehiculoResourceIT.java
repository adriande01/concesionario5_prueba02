package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Vehiculo;
import com.mycompany.myapp.domain.enumeration.Combustible;
import com.mycompany.myapp.repository.VehiculoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VehiculoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VehiculoResourceIT {

    private static final String DEFAULT_MODELO_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MODELO_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MARCA_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final Combustible DEFAULT_TIPO = Combustible.GASOLINA;
    private static final Combustible UPDATED_TIPO = Combustible.DIESEL;

    private static final Boolean DEFAULT_HIBRIDO = false;
    private static final Boolean UPDATED_HIBRIDO = true;

    private static final String ENTITY_API_URL = "/api/vehiculos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVehiculoMockMvc;

    private Vehiculo vehiculo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vehiculo createEntity(EntityManager em) {
        Vehiculo vehiculo = new Vehiculo()
            .modeloName(DEFAULT_MODELO_NAME)
            .marcaName(DEFAULT_MARCA_NAME)
            .precio(DEFAULT_PRECIO)
            .tipo(DEFAULT_TIPO)
            .hibrido(DEFAULT_HIBRIDO);
        return vehiculo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vehiculo createUpdatedEntity(EntityManager em) {
        Vehiculo vehiculo = new Vehiculo()
            .modeloName(UPDATED_MODELO_NAME)
            .marcaName(UPDATED_MARCA_NAME)
            .precio(UPDATED_PRECIO)
            .tipo(UPDATED_TIPO)
            .hibrido(UPDATED_HIBRIDO);
        return vehiculo;
    }

    @BeforeEach
    public void initTest() {
        vehiculo = createEntity(em);
    }

    @Test
    @Transactional
    void createVehiculo() throws Exception {
        int databaseSizeBeforeCreate = vehiculoRepository.findAll().size();
        // Create the Vehiculo
        restVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isCreated());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeCreate + 1);
        Vehiculo testVehiculo = vehiculoList.get(vehiculoList.size() - 1);
        assertThat(testVehiculo.getModeloName()).isEqualTo(DEFAULT_MODELO_NAME);
        assertThat(testVehiculo.getMarcaName()).isEqualTo(DEFAULT_MARCA_NAME);
        assertThat(testVehiculo.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testVehiculo.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testVehiculo.getHibrido()).isEqualTo(DEFAULT_HIBRIDO);
    }

    @Test
    @Transactional
    void createVehiculoWithExistingId() throws Exception {
        // Create the Vehiculo with an existing ID
        vehiculo.setId(1L);

        int databaseSizeBeforeCreate = vehiculoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isBadRequest());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkModeloNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehiculoRepository.findAll().size();
        // set the field null
        vehiculo.setModeloName(null);

        // Create the Vehiculo, which fails.

        restVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isBadRequest());

        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMarcaNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehiculoRepository.findAll().size();
        // set the field null
        vehiculo.setMarcaName(null);

        // Create the Vehiculo, which fails.

        restVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isBadRequest());

        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecioIsRequired() throws Exception {
        int databaseSizeBeforeTest = vehiculoRepository.findAll().size();
        // set the field null
        vehiculo.setPrecio(null);

        // Create the Vehiculo, which fails.

        restVehiculoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isBadRequest());

        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVehiculos() throws Exception {
        // Initialize the database
        vehiculoRepository.saveAndFlush(vehiculo);

        // Get all the vehiculoList
        restVehiculoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vehiculo.getId().intValue())))
            .andExpect(jsonPath("$.[*].modeloName").value(hasItem(DEFAULT_MODELO_NAME)))
            .andExpect(jsonPath("$.[*].marcaName").value(hasItem(DEFAULT_MARCA_NAME)))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].hibrido").value(hasItem(DEFAULT_HIBRIDO.booleanValue())));
    }

    @Test
    @Transactional
    void getVehiculo() throws Exception {
        // Initialize the database
        vehiculoRepository.saveAndFlush(vehiculo);

        // Get the vehiculo
        restVehiculoMockMvc
            .perform(get(ENTITY_API_URL_ID, vehiculo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vehiculo.getId().intValue()))
            .andExpect(jsonPath("$.modeloName").value(DEFAULT_MODELO_NAME))
            .andExpect(jsonPath("$.marcaName").value(DEFAULT_MARCA_NAME))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.hibrido").value(DEFAULT_HIBRIDO.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingVehiculo() throws Exception {
        // Get the vehiculo
        restVehiculoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVehiculo() throws Exception {
        // Initialize the database
        vehiculoRepository.saveAndFlush(vehiculo);

        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();

        // Update the vehiculo
        Vehiculo updatedVehiculo = vehiculoRepository.findById(vehiculo.getId()).get();
        // Disconnect from session so that the updates on updatedVehiculo are not directly saved in db
        em.detach(updatedVehiculo);
        updatedVehiculo
            .modeloName(UPDATED_MODELO_NAME)
            .marcaName(UPDATED_MARCA_NAME)
            .precio(UPDATED_PRECIO)
            .tipo(UPDATED_TIPO)
            .hibrido(UPDATED_HIBRIDO);

        restVehiculoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVehiculo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVehiculo))
            )
            .andExpect(status().isOk());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
        Vehiculo testVehiculo = vehiculoList.get(vehiculoList.size() - 1);
        assertThat(testVehiculo.getModeloName()).isEqualTo(UPDATED_MODELO_NAME);
        assertThat(testVehiculo.getMarcaName()).isEqualTo(UPDATED_MARCA_NAME);
        assertThat(testVehiculo.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testVehiculo.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testVehiculo.getHibrido()).isEqualTo(UPDATED_HIBRIDO);
    }

    @Test
    @Transactional
    void putNonExistingVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();
        vehiculo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehiculoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vehiculo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();
        vehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();
        vehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVehiculoWithPatch() throws Exception {
        // Initialize the database
        vehiculoRepository.saveAndFlush(vehiculo);

        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();

        // Update the vehiculo using partial update
        Vehiculo partialUpdatedVehiculo = new Vehiculo();
        partialUpdatedVehiculo.setId(vehiculo.getId());

        partialUpdatedVehiculo.modeloName(UPDATED_MODELO_NAME);

        restVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehiculo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehiculo))
            )
            .andExpect(status().isOk());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
        Vehiculo testVehiculo = vehiculoList.get(vehiculoList.size() - 1);
        assertThat(testVehiculo.getModeloName()).isEqualTo(UPDATED_MODELO_NAME);
        assertThat(testVehiculo.getMarcaName()).isEqualTo(DEFAULT_MARCA_NAME);
        assertThat(testVehiculo.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testVehiculo.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testVehiculo.getHibrido()).isEqualTo(DEFAULT_HIBRIDO);
    }

    @Test
    @Transactional
    void fullUpdateVehiculoWithPatch() throws Exception {
        // Initialize the database
        vehiculoRepository.saveAndFlush(vehiculo);

        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();

        // Update the vehiculo using partial update
        Vehiculo partialUpdatedVehiculo = new Vehiculo();
        partialUpdatedVehiculo.setId(vehiculo.getId());

        partialUpdatedVehiculo
            .modeloName(UPDATED_MODELO_NAME)
            .marcaName(UPDATED_MARCA_NAME)
            .precio(UPDATED_PRECIO)
            .tipo(UPDATED_TIPO)
            .hibrido(UPDATED_HIBRIDO);

        restVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVehiculo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVehiculo))
            )
            .andExpect(status().isOk());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
        Vehiculo testVehiculo = vehiculoList.get(vehiculoList.size() - 1);
        assertThat(testVehiculo.getModeloName()).isEqualTo(UPDATED_MODELO_NAME);
        assertThat(testVehiculo.getMarcaName()).isEqualTo(UPDATED_MARCA_NAME);
        assertThat(testVehiculo.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testVehiculo.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testVehiculo.getHibrido()).isEqualTo(UPDATED_HIBRIDO);
    }

    @Test
    @Transactional
    void patchNonExistingVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();
        vehiculo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vehiculo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();
        vehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vehiculo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVehiculo() throws Exception {
        int databaseSizeBeforeUpdate = vehiculoRepository.findAll().size();
        vehiculo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVehiculoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vehiculo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vehiculo in the database
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVehiculo() throws Exception {
        // Initialize the database
        vehiculoRepository.saveAndFlush(vehiculo);

        int databaseSizeBeforeDelete = vehiculoRepository.findAll().size();

        // Delete the vehiculo
        restVehiculoMockMvc
            .perform(delete(ENTITY_API_URL_ID, vehiculo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vehiculo> vehiculoList = vehiculoRepository.findAll();
        assertThat(vehiculoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
