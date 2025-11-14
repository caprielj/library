// Define dónde se encuentran físicamente los libros en la biblioteca

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

/**
 * Modelo Ubicacion
 * 
 * Representa la ubicación física de los libros:
 * - Sección (Infantil, Adultos, Referencia)
 * - Estante (número o código)
 * - Nivel (A, B, C, etc.)
 */
const Ubicacion = sequelize.define('Ubicacion', {
    // CAMPO: id 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único de la ubicación'
    },
    
    // CAMPO: seccion 
    // Sección de la biblioteca (ej: Infantil, Adultos, Referencia)
    seccion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Sección de la biblioteca (Infantil, Adultos, Referencia, etc)',
        validate: {
            notEmpty: {
                msg: 'La sección no puede estar vacía'
            }
        }
    },
    
    // CAMPO: estante
    // Número o código del estante
    estante: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Número o código del estante (E001, E002, etc)',
        validate: {
            notEmpty: {
                msg: 'El estante no puede estar vacío'
            }
        }
    },
    
    // CAMPO: nivel
    // Nivel del estante (A=arriba, B=medio, C=abajo)
    nivel: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'Nivel del estante (A, B, C, etc)',
        validate: {
            len: {
                args: [1, 10],
                msg: 'El nivel debe tener entre 1 y 10 caracteres'
            }
        }
    },
    
    // CAMPO: descripcion 
    // Descripción adicional de la ubicación
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción adicional de la ubicación'
    },
    
    // CAMPO: estado 
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Activo, 0=Inactivo (en mantenimiento o no disponible)',
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: 'El estado debe ser 0 o 1'
            }
        }
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
    tableName: 'Ubicaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: false,
    
    // Índice único para evitar ubicaciones duplicadas
    indexes: [
        {
            unique: true,
            fields: ['seccion', 'estante', 'nivel']
        }
    ]
});

/**
 * Método para obtener el código completo de la ubicación
 * 
 * Uso: ubicacion.getCodigoCompleto()
 * Retorna: "Infantil-E001-A"
 */
Ubicacion.prototype.getCodigoCompleto = function() {
    return `${this.seccion}-${this.estante}${this.nivel ? '-' + this.nivel : ''}`;
};

module.exports = Ubicacion;