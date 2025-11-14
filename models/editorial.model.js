
// Define la estructura de la tabla Editoriales en la base de datos
// Las editoriales son las casas publicadoras de los libros

// Importar DataTypes de Sequelize para definir tipos de datos
const { DataTypes } = require('sequelize');

// Importar la conexión a la base de datos
const { sequelize } = require('../db/db');

/**
 * Modelo Editorial
 * 
 * Representa las casas editoriales que publican los libros:
 * - Nombre de la editorial
 * - Ubicación (país, ciudad, dirección)
 * - Información de contacto (teléfono, email, sitio web)
 */
const Editorial = sequelize.define('Editorial', {
    // CAMPO: id 
    // Clave primaria auto-incremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la editorial'
    },
    
    // CAMPO: nombre
    // Nombre de la editorial (debe ser único)
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: {
            name: 'nombre_editorial_unique',
            msg: 'Esta editorial ya está registrada'
        },
        comment: 'Nombre de la editorial (Editorial Planeta, Penguin, etc)',
        validate: {
            notEmpty: {
                msg: 'El nombre de la editorial no puede estar vacío'
            },
            len: {
                args: [2, 150],
                msg: 'El nombre debe tener entre 2 y 150 caracteres'
            }
        }
    },
    
    // AMPO: pais 
    // País donde está ubicada la editorial
    pais: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'País donde está ubicada la editorial'
    },
    
    // CAMPO: ciudad
    // Ciudad de la editorial
    ciudad: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Ciudad donde tiene sede la editorial'
    },
    
    // CAMPO: direccion 
    // Dirección física de la editorial
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Dirección física de la editorial'
    },
    
    // CAMPO: telefono
    // Teléfono de contacto
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Teléfono de contacto de la editorial',
        validate: {
            is: {
                args: /^[0-9+\-\s()]*$/,
                msg: 'El teléfono solo puede contener números y símbolos +, -, (), espacios'
            }
        }
    },
    
    // CAMPO: email 
    // Email de contacto de la editorial
    email: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: 'Email de contacto de la editorial',
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    
    // CAMPO: sitio_web 
    // Página web oficial de la editorial
    sitio_web: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Sitio web oficial de la editorial',
        validate: {
            isUrl: {
                msg: 'Debe ser una URL válida (https://ejemplo.com)'
            }
        }
    },
    
    // CAMPO: estado 
    // Indica si la editorial está activa
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Activo, 0=Inactivo',
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: 'El estado debe ser 0 o 1'
            }
        }
    },
    
    // CAMPOS DE TIMESTAMP 
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
    // CONFIGURACIÓN DEL MODELO
    tableName: 'Editoriales',      // Nombre de la tabla en la BD
    timestamps: true,               // Usar timestamps automáticos
    createdAt: 'created_at',       // Mapear createdAt a created_at
    updatedAt: 'updated_at',       // Mapear updatedAt a updated_at
    underscored: false
});

// Exportar el modelo para usarlo en controladores
module.exports = Editorial;