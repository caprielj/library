// Define la estructura de la tabla Idiomas en la base de datos
// Representa los idiomas en los que están disponibles los libros

// Importar DataTypes de Sequelize para definir tipos de datos
const { DataTypes } = require('sequelize');

// Importar la conexión a la base de datos
const { sequelize } = require('../db/db');

/**
 * Modelo Idioma
 * 
 * Representa los idiomas disponibles de los libros:
 * - Español (es)
 * - Inglés (en)
 * - Francés (fr)
 * - Etc.
 */
const Idioma = sequelize.define('Idioma', {
    // CAMPO: id 
    // Clave primaria auto-incremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del idioma'
    },
    
    // CAMPO: nombre 
    // Nombre del idioma (debe ser único)
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            name: 'nombre_idioma_unique',
            msg: 'Este idioma ya está registrado'
        },
        comment: 'Nombre del idioma (Español, Inglés, Francés, etc)',
        validate: {
            notEmpty: {
                msg: 'El nombre del idioma no puede estar vacío'
            },
            len: {
                args: [2, 50],
                msg: 'El nombre debe tener entre 2 y 50 caracteres'
            }
        }
    },
    
    // CAMPO: codigo 
    // Código ISO del idioma (2 letras)
    codigo: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: {
            name: 'codigo_idioma_unique',
            msg: 'Este código de idioma ya está registrado'
        },
        comment: 'Código ISO del idioma (es, en, fr, de, it)',
        validate: {
            notEmpty: {
                msg: 'El código del idioma no puede estar vacío'
            },
            len: {
                args: [2, 5],
                msg: 'El código debe tener entre 2 y 5 caracteres'
            },
            // Validar que el código esté en minúsculas
            isLowercase: {
                msg: 'El código debe estar en minúsculas (es, en, fr)'
            }
        }
    },
    
    // CAMPO: estado
    // Indica si el idioma está activo
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
    tableName: 'Idiomas',          // Nombre de la tabla en la BD
    timestamps: true,               // Usar timestamps automáticos
    createdAt: 'created_at',       
    updatedAt: 'updated_at',
    underscored: false
});

/**
 * Método estático para buscar idioma por código
 * 
 * Uso: const idioma = await Idioma.buscarPorCodigo('es');
 */
Idioma.buscarPorCodigo = async function(codigo) {
    return await this.findOne({
        where: { 
            codigo: codigo.toLowerCase() // Convertir a minúsculas para la búsqueda
        }
    });
};

// Exportar el modelo para usarlo en controladores
module.exports = Idioma;