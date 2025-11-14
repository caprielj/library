// Define los posibles estados de un ejemplar físico

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

/**
 * Modelo EstadoEjemplar
 * 
 * Estados posibles de un ejemplar físico:
 * - Disponible (se puede prestar)
 * - Prestado (actualmente en préstamo)
 * - En Mantenimiento (en reparación)
 * - Extraviado (reportado como perdido)
 * - Dado de Baja (retirado del inventario)
 */
const EstadoEjemplar = sequelize.define('EstadoEjemplar', {
    // CAMPO: id 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único del estado'
    },
    
    // CAMPO: nombre
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nombre del estado (Disponible, Prestado, etc)',
        validate: {
            notEmpty: {
                msg: 'El nombre del estado no puede estar vacío'
            }
        }
    },
    
    // CAMPO: descripcion 
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción del estado'
    },
    
    // CAMPO: permite_prestamo 
    // Indica si en este estado se puede prestar el ejemplar
    permite_prestamo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Indica si en este estado se puede prestar el ejemplar'
    },
    
    // TIMESTAMPS 
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'EstadosEjemplar',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = EstadoEjemplar;