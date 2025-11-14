
// Representa las copias físicas de cada libro

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Importar modelos relacionados
const Libro = require('./libro.model');
const Ubicacion = require('./ubicacion.model');
const EstadoEjemplar = require('./estadoejemplar.model');

/**
 * Modelo Ejemplar
 * 
 * Representa una copia física de un libro:
 * - Un libro puede tener múltiples ejemplares
 * - Cada ejemplar tiene un código único
 * - Tiene una ubicación física en la biblioteca
 * - Tiene un estado (disponible, prestado, etc)
 */
const Ejemplar = sequelize.define('Ejemplar', {
    // CAMPO: id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único del ejemplar'
    },
    
    // CAMPO: libro_id
    // Relaciona con la tabla Libros
    libro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del libro al que pertenece este ejemplar',
        references: {
            model: 'Libros',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El libro es obligatorio'
            }
        }
    },
    
    // CAMPO: codigo_ejemplar
    // Código único del ejemplar físico (ej: LIB-001-E001)
    codigo_ejemplar: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            name: 'codigo_ejemplar_unique',
            msg: 'Este código de ejemplar ya existe'
        },
        comment: 'Código único del ejemplar físico (LIB-001-E001)',
        validate: {
            notEmpty: {
                msg: 'El código no puede estar vacío'
            }
        }
    },
    
    // CAMPO: ubicacion_id
    // Relaciona con la tabla Ubicaciones
    ubicacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID de la ubicación física del ejemplar',
        references: {
            model: 'Ubicaciones',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'La ubicación es obligatoria'
            }
        }
    },
    
    // CAMPO: estado_id
    // Relaciona con la tabla EstadosEjemplar
    estado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del estado actual del ejemplar',
        references: {
            model: 'EstadosEjemplar',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El estado es obligatorio'
            }
        }
    },
    
    // CAMPO: fecha_adquisicion
    // Fecha en que se adquirió el ejemplar
    fecha_adquisicion: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha en que se adquirió el ejemplar',
        validate: {
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    
    // CAMPO: condicion
    // Condición física del ejemplar
    condicion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Condición física (Nuevo, Bueno, Regular, Malo)',
        validate: {
            isIn: {
                args: [['Nuevo', 'Bueno', 'Regular', 'Malo']],
                msg: 'La condición debe ser: Nuevo, Bueno, Regular o Malo'
            }
        }
    },
    
    // CAMPO: observaciones
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones sobre el ejemplar'
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
    tableName: 'Ejemplares',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
    // Índices para optimizar búsquedas
    indexes: [
        {
            name: 'idx_ejemplares_libro',
            fields: ['libro_id']
        },
        {
            name: 'idx_ejemplares_codigo',
            fields: ['codigo_ejemplar']
        },
        {
            name: 'idx_ejemplares_estado',
            fields: ['estado_id']
        }
    ]
});

// RELACIONES

/**
 * Relación: Ejemplar pertenece a un Libro
 */
Ejemplar.belongsTo(Libro, {
    foreignKey: 'libro_id',
    as: 'libro',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Libro tiene muchos Ejemplares
 */
Libro.hasMany(Ejemplar, {
    foreignKey: 'libro_id',
    as: 'ejemplares',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Ejemplar pertenece a una Ubicación
 */
Ejemplar.belongsTo(Ubicacion, {
    foreignKey: 'ubicacion_id',
    as: 'ubicacion',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Ubicación tiene muchos Ejemplares
 */
Ubicacion.hasMany(Ejemplar, {
    foreignKey: 'ubicacion_id',
    as: 'ejemplares',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Ejemplar pertenece a un Estado
 */
Ejemplar.belongsTo(EstadoEjemplar, {
    foreignKey: 'estado_id',
    as: 'estado',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Estado tiene muchos Ejemplares
 */
EstadoEjemplar.hasMany(Ejemplar, {
    foreignKey: 'estado_id',
    as: 'ejemplares',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// MÉTODOS

/**
 * Verificar si el ejemplar está disponible para préstamo
 */
Ejemplar.prototype.estaDisponible = async function() {
    const estado = await this.getEstado();
    return estado && estado.permite_prestamo === true;
};

/**
 * Buscar ejemplares disponibles de un libro
 */
Ejemplar.buscarDisponibles = async function(libroId) {
    // Primero obtenemos el ID del estado "Disponible"
    const estadoDisponible = await EstadoEjemplar.findOne({
        where: { nombre: 'Disponible' }
    });
    
    if (!estadoDisponible) {
        return [];
    }
    
    return await this.findAll({
        where: {
            libro_id: libroId,
            estado_id: estadoDisponible.id
        },
        include: [
            { model: Libro, as: 'libro' },
            { model: Ubicacion, as: 'ubicacion' },
            { model: EstadoEjemplar, as: 'estado' }
        ]
    });
};

module.exports = Ejemplar;