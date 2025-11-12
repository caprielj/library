// =====================================================
// MODELO: ROLES
// Archivo: models/rol.model.js
// =====================================================
// Define la estructura de la tabla Roles en la base de datos
// Un Rol agrupa permisos y determina qué puede hacer un usuario

// Importar DataTypes de Sequelize para definir tipos de datos
const { DataTypes } = require('sequelize');

// Importar la conexión a la base de datos
const { sequelize } = require('../config/database');

/**
 * Modelo Rol
 * 
 * Representa los diferentes tipos de usuarios en el sistema:
 * - Administrador: Control total
 * - Bibliotecario: Gestiona préstamos
 * - Usuario: Usuario regular
 */
const Rol = sequelize.define('Rol', {
    // Campo: id
    // Clave primaria auto-incremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del rol'
    },
    
    // Campo: nombre
    // Nombre del rol (debe ser único)
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Nombre del rol (Administrador, Bibliotecario, Usuario)',
        validate: {
            notEmpty: {
                msg: 'El nombre del rol no puede estar vacío'
            },
            len: {
                args: [3, 50],
                msg: 'El nombre debe tener entre 3 y 50 caracteres'
            }
        }
    },
    
    // Campo: descripcion
    // Descripción detallada del rol
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada del rol'
    },
    
    // Campo: estado
    // Indica si el rol está activo (1) o inactivo (0)
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Activo, 0=Inactivo',
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: 'El estado debe ser 0 (inactivo) o 1 (activo)'
            }
        }
    },
    
    // Campos de timestamp automáticos
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de creación del registro'
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de última actualización'
    }
}, {
    // Configuración del modelo
    tableName: 'Roles',           // Nombre de la tabla en la BD
    timestamps: true,              // Usar timestamps
    createdAt: 'created_at',      // Mapear createdAt a created_at
    updatedAt: 'updated_at',      // Mapear updatedAt a updated_at
    underscored: false             // No usar snake_case automático
});

// Exportar el modelo para usarlo en controladores
module.exports = Rol;