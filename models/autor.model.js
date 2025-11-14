// Define la estructura de la tabla Autores en la base de datos

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

/**
 * Modelo Autor
 * Almacena información sobre los autores de los libros
 */
const Autor = sequelize.define('Autor', {
    // Campo: id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del autor'
    },
    
    // Campo: nombre
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Nombre del autor',
        validate: {
            notEmpty: {
                msg: 'El nombre del autor no puede estar vacío'
            },
            len: {
                args: [2, 150],
                msg: 'El nombre debe tener entre 2 y 150 caracteres'
            }
        }
    },
    
    // Campo: apellido
    apellido: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: 'Apellido del autor',
        validate: {
            notEmpty: {
                msg: 'El apellido del autor no puede estar vacío'
            },
            len: {
                args: [2, 150],
                msg: 'El apellido debe tener entre 2 y 150 caracteres'
            }
        }
    },
    
    // Campo: nacionalidad
    nacionalidad: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'País de origen del autor'
    },
    
    // Campo: fecha_nacimiento
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha de nacimiento del autor',
        validate: {
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    
    // Campo: biografia
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Biografía del autor'
    },
    
    // Campo: estado
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
    
    // Timestamps
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
    tableName: 'Autores',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: false
});

// Método para obtener el nombre completo del autor
Autor.prototype.getNombreCompleto = function() {
    return `${this.nombre} ${this.apellido}`;
};

module.exports = Autor;