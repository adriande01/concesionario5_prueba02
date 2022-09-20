package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Vendedor;
import com.mycompany.myapp.repository.VendedorRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link VendedorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VendedorResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final Instant DEFAULT_HIRE_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_HIRE_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Double DEFAULT_SALARY = 1D;
    private static final Double UPDATED_SALARY = 2D;

    private static final Double DEFAULT_COMMISSION_PCT = 1D;
    private static final Double UPDATED_COMMISSION_PCT = 2D;

    private static final String ENTITY_API_URL = "/api/vendedors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VendedorRepository vendedorRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVendedorMockMvc;

    private Vendedor vendedor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vendedor createEntity(EntityManager em) {
        Vendedor vendedor = new Vendedor()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .email(DEFAULT_EMAIL)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .hireDate(DEFAULT_HIRE_DATE)
            .salary(DEFAULT_SALARY)
            .commissionPct(DEFAULT_COMMISSION_PCT);
        return vendedor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Vendedor createUpdatedEntity(EntityManager em) {
        Vendedor vendedor = new Vendedor()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);
        return vendedor;
    }

    @BeforeEach
    public void initTest() {
        vendedor = createEntity(em);
    }

    @Test
    @Transactional
    void createVendedor() throws Exception {
        int databaseSizeBeforeCreate = vendedorRepository.findAll().size();
        // Create the Vendedor
        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isCreated());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeCreate + 1);
        Vendedor testVendedor = vendedorList.get(vendedorList.size() - 1);
        assertThat(testVendedor.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testVendedor.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testVendedor.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVendedor.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testVendedor.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testVendedor.getSalary()).isEqualTo(DEFAULT_SALARY);
        assertThat(testVendedor.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void createVendedorWithExistingId() throws Exception {
        // Create the Vendedor with an existing ID
        vendedor.setId(1L);

        int databaseSizeBeforeCreate = vendedorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setFirstName(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setLastName(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setEmail(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setPhoneNumber(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHireDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setHireDate(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSalaryIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setSalary(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCommissionPctIsRequired() throws Exception {
        int databaseSizeBeforeTest = vendedorRepository.findAll().size();
        // set the field null
        vendedor.setCommissionPct(null);

        // Create the Vendedor, which fails.

        restVendedorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isBadRequest());

        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllVendedors() throws Exception {
        // Initialize the database
        vendedorRepository.saveAndFlush(vendedor);

        // Get all the vendedorList
        restVendedorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(vendedor.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].hireDate").value(hasItem(DEFAULT_HIRE_DATE.toString())))
            .andExpect(jsonPath("$.[*].salary").value(hasItem(DEFAULT_SALARY.doubleValue())))
            .andExpect(jsonPath("$.[*].commissionPct").value(hasItem(DEFAULT_COMMISSION_PCT.doubleValue())));
    }

    @Test
    @Transactional
    void getVendedor() throws Exception {
        // Initialize the database
        vendedorRepository.saveAndFlush(vendedor);

        // Get the vendedor
        restVendedorMockMvc
            .perform(get(ENTITY_API_URL_ID, vendedor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(vendedor.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.hireDate").value(DEFAULT_HIRE_DATE.toString()))
            .andExpect(jsonPath("$.salary").value(DEFAULT_SALARY.doubleValue()))
            .andExpect(jsonPath("$.commissionPct").value(DEFAULT_COMMISSION_PCT.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingVendedor() throws Exception {
        // Get the vendedor
        restVendedorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVendedor() throws Exception {
        // Initialize the database
        vendedorRepository.saveAndFlush(vendedor);

        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();

        // Update the vendedor
        Vendedor updatedVendedor = vendedorRepository.findById(vendedor.getId()).get();
        // Disconnect from session so that the updates on updatedVendedor are not directly saved in db
        em.detach(updatedVendedor);
        updatedVendedor
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restVendedorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVendedor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVendedor))
            )
            .andExpect(status().isOk());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
        Vendedor testVendedor = vendedorList.get(vendedorList.size() - 1);
        assertThat(testVendedor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testVendedor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testVendedor.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVendedor.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testVendedor.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testVendedor.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testVendedor.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void putNonExistingVendedor() throws Exception {
        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();
        vendedor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVendedorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, vendedor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendedor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVendedor() throws Exception {
        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();
        vendedor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendedorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(vendedor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVendedor() throws Exception {
        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();
        vendedor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendedorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVendedorWithPatch() throws Exception {
        // Initialize the database
        vendedorRepository.saveAndFlush(vendedor);

        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();

        // Update the vendedor using partial update
        Vendedor partialUpdatedVendedor = new Vendedor();
        partialUpdatedVendedor.setId(vendedor.getId());

        partialUpdatedVendedor.firstName(UPDATED_FIRST_NAME).salary(UPDATED_SALARY);

        restVendedorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVendedor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVendedor))
            )
            .andExpect(status().isOk());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
        Vendedor testVendedor = vendedorList.get(vendedorList.size() - 1);
        assertThat(testVendedor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testVendedor.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testVendedor.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVendedor.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testVendedor.getHireDate()).isEqualTo(DEFAULT_HIRE_DATE);
        assertThat(testVendedor.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testVendedor.getCommissionPct()).isEqualTo(DEFAULT_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void fullUpdateVendedorWithPatch() throws Exception {
        // Initialize the database
        vendedorRepository.saveAndFlush(vendedor);

        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();

        // Update the vendedor using partial update
        Vendedor partialUpdatedVendedor = new Vendedor();
        partialUpdatedVendedor.setId(vendedor.getId());

        partialUpdatedVendedor
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .email(UPDATED_EMAIL)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .hireDate(UPDATED_HIRE_DATE)
            .salary(UPDATED_SALARY)
            .commissionPct(UPDATED_COMMISSION_PCT);

        restVendedorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVendedor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVendedor))
            )
            .andExpect(status().isOk());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
        Vendedor testVendedor = vendedorList.get(vendedorList.size() - 1);
        assertThat(testVendedor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testVendedor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testVendedor.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVendedor.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testVendedor.getHireDate()).isEqualTo(UPDATED_HIRE_DATE);
        assertThat(testVendedor.getSalary()).isEqualTo(UPDATED_SALARY);
        assertThat(testVendedor.getCommissionPct()).isEqualTo(UPDATED_COMMISSION_PCT);
    }

    @Test
    @Transactional
    void patchNonExistingVendedor() throws Exception {
        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();
        vendedor.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVendedorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, vendedor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vendedor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVendedor() throws Exception {
        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();
        vendedor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendedorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(vendedor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVendedor() throws Exception {
        int databaseSizeBeforeUpdate = vendedorRepository.findAll().size();
        vendedor.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVendedorMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(vendedor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Vendedor in the database
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVendedor() throws Exception {
        // Initialize the database
        vendedorRepository.saveAndFlush(vendedor);

        int databaseSizeBeforeDelete = vendedorRepository.findAll().size();

        // Delete the vendedor
        restVendedorMockMvc
            .perform(delete(ENTITY_API_URL_ID, vendedor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Vendedor> vendedorList = vendedorRepository.findAll();
        assertThat(vendedorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
