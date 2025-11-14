// Define los estados del ciclo de vida de un préstamo

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

/**
 * Modelo EstadoPrestamo
 * 
 * Estados del préstamo:
 * - Activo: El libro está prestado actualmente
 * - Devuelto: El libro fue devuelto correctamente
 * - Vencido: Se pasó la fecha límite
 * - Cancelado: El préstamo fue cancelado
 */
const EstadoPrestamo = sequelize.define('EstadoPrestamo', {
    // ===== CAMPO: id =====
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único del estado de préstamo'
    },
    
    // CAMPO: nombre 
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nombre del estado (Activo, Devuelto, Vencido, Cancelado)',
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
    tableName: 'EstadosPrestamo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = EstadoPrestamo;