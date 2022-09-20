package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Combustible;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vehiculo.
 */
@Entity
@Table(name = "vehiculo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Vehiculo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "modelo_name", nullable = false)
    private String modeloName;

    @NotNull
    @Column(name = "marca_name", nullable = false)
    private String marcaName;

    @NotNull
    @Column(name = "precio", nullable = false)
    private Double precio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private Combustible tipo;

    @Column(name = "hibrido")
    private Boolean hibrido;

    @JsonIgnoreProperties(value = { "vehiculo", "cliente", "vendedor" }, allowSetters = true)
    @OneToOne(mappedBy = "vehiculo")
    private Venta venta;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vehiculo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModeloName() {
        return this.modeloName;
    }

    public Vehiculo modeloName(String modeloName) {
        this.setModeloName(modeloName);
        return this;
    }

    public void setModeloName(String modeloName) {
        this.modeloName = modeloName;
    }

    public String getMarcaName() {
        return this.marcaName;
    }

    public Vehiculo marcaName(String marcaName) {
        this.setMarcaName(marcaName);
        return this;
    }

    public void setMarcaName(String marcaName) {
        this.marcaName = marcaName;
    }

    public Double getPrecio() {
        return this.precio;
    }

    public Vehiculo precio(Double precio) {
        this.setPrecio(precio);
        return this;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public Combustible getTipo() {
        return this.tipo;
    }

    public Vehiculo tipo(Combustible tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(Combustible tipo) {
        this.tipo = tipo;
    }

    public Boolean getHibrido() {
        return this.hibrido;
    }

    public Vehiculo hibrido(Boolean hibrido) {
        this.setHibrido(hibrido);
        return this;
    }

    public void setHibrido(Boolean hibrido) {
        this.hibrido = hibrido;
    }

    public Venta getVenta() {
        return this.venta;
    }

    public void setVenta(Venta venta) {
        if (this.venta != null) {
            this.venta.setVehiculo(null);
        }
        if (venta != null) {
            venta.setVehiculo(this);
        }
        this.venta = venta;
    }

    public Vehiculo venta(Venta venta) {
        this.setVenta(venta);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vehiculo)) {
            return false;
        }
        return id != null && id.equals(((Vehiculo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vehiculo{" +
            "id=" + getId() +
            ", modeloName='" + getModeloName() + "'" +
            ", marcaName='" + getMarcaName() + "'" +
            ", precio=" + getPrecio() +
            ", tipo='" + getTipo() + "'" +
            ", hibrido='" + getHibrido() + "'" +
            "}";
    }
}
