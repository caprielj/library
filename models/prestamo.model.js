// Gestiona los préstamos de libros a usuarios

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Importar modelos relacionados
const Usuario = require('./usuario.model');
const Ejemplar = require('./ejemplar.model');
const EstadoPrestamo = require('./estadoPrestamo.model');

/**
 * Modelo Prestamo
 * 
 * Registra cuando un usuario toma prestado un ejemplar:
 * - Usuario que solicita el préstamo
 * - Ejemplar que se presta
 * - Bibliotecario que registra el préstamo
 * - Fechas: préstamo y devolución estimada
 * - Estado del préstamo
 */
const Prestamo = sequelize.define('Prestamo', {
    // CAMPO: id 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único del préstamo'
    },
    
    // CAMPO: usuario_id
    // Usuario que solicita el préstamo
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario que solicita el préstamo',
        references: {
            model: 'Usuarios',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El usuario es obligatorio'
            }
        }
    },
    
    // CAMPO: ejemplar_id 
    // Ejemplar que se presta
    ejemplar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del ejemplar que se presta',
        references: {
            model: 'Ejemplares',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El ejemplar es obligatorio'
            }
        }
    },
    
    // CAMPO: bibliotecario_id 
    // Usuario con rol bibliotecario que registra el préstamo
    bibliotecario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del bibliotecario que registra el préstamo',
        references: {
            model: 'Usuarios',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El bibliotecario es obligatorio'
            }
        }
    },
    
    // CAMPO: estado_id 
    // Estado actual del préstamo
    estado_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del estado actual del préstamo',
        references: {
            model: 'EstadosPrestamo',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El estado es obligatorio'
            }
        }
    },
    
    // CAMPO: fecha_prestamo 
    // Fecha en que se realizó el préstamo
    fecha_prestamo: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha en que se realizó el préstamo',
        validate: {
            notNull: {
                msg: 'La fecha de préstamo es obligatoria'
            },
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    
    // CAMPO: fecha_devolucion_estimada
    // Fecha límite para devolver el libro
    fecha_devolucion_estimada: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha límite para devolver el libro',
        validate: {
            notNull: {
                msg: 'La fecha de devolución estimada es obligatoria'
            },
            isDate: {
                msg: 'Debe ser una fecha válida'
            },
            // Validar que la fecha de devolución sea posterior al préstamo
            esPosteriorAlPrestamo(value) {
                if (this.fecha_prestamo && value) {
                    const fechaPrestamo = new Date(this.fecha_prestamo);
                    const fechaDevolucion = new Date(value);
                    
                    if (fechaDevolucion <= fechaPrestamo) {
                        throw new Error('La fecha de devolución debe ser posterior a la fecha de préstamo');
                    }
                }
            }
        }
    },
    
    // CAMPO: observaciones
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones del préstamo'
    },
    
    // TIMESTAMPS
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de creación del registro'
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de última actualización'
    }
}, {
    tableName: 'Prestamos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
    // Índices para optimizar búsquedas
    indexes: [
        {
            name: 'idx_prestamos_usuario',
            fields: ['usuario_id']
        },
        {
            name: 'idx_prestamos_ejemplar',
            fields: ['ejemplar_id']
        },
        {
            name: 'idx_prestamos_estado',
            fields: ['estado_id']
        },
        {
            name: 'idx_prestamos_fecha',
            fields: ['fecha_prestamo']
        }
    ]
});


// RELACIONES

/**
 * Relación: Préstamo pertenece a un Usuario (el que solicita)
 */
Prestamo.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario',              // Alias: prestamo.usuario
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Usuario tiene muchos Préstamos
 */
Usuario.hasMany(Prestamo, {
    foreignKey: 'usuario_id',
    as: 'prestamos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Préstamo pertenece a un Ejemplar
 */
Prestamo.belongsTo(Ejemplar, {
    foreignKey: 'ejemplar_id',
    as: 'ejemplar',             // Alias: prestamo.ejemplar
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Ejemplar tiene muchos Préstamos
 */
Ejemplar.hasMany(Prestamo, {
    foreignKey: 'ejemplar_id',
    as: 'prestamos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Préstamo pertenece a un Bibliotecario (Usuario)
 */
Prestamo.belongsTo(Usuario, {
    foreignKey: 'bibliotecario_id',
    as: 'bibliotecario',        // Alias: prestamo.bibliotecario
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Préstamo pertenece a un Estado
 */
Prestamo.belongsTo(EstadoPrestamo, {
    foreignKey: 'estado_id',
    as: 'estado',               // Alias: prestamo.estado
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Estado tiene muchos Préstamos
 */
EstadoPrestamo.hasMany(Prestamo, {
    foreignKey: 'estado_id',
    as: 'prestamos',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});


// MÉTODOS DE INSTANCIA

/**
 * Calcular días de retraso
 * 
 * Uso: const diasRetraso = prestamo.calcularDiasRetraso();
 * Retorna: número de días de retraso (0 si no hay retraso)
 */
Prestamo.prototype.calcularDiasRetraso = function() {
    const hoy = new Date();
    const fechaDevolucion = new Date(this.fecha_devolucion_estimada);
    
    // Si aún no se pasa la fecha, no hay retraso
    if (hoy <= fechaDevolucion) {
        return 0;
    }
    
    // Calcular diferencia en días
    const diferenciaMilisegundos = hoy - fechaDevolucion;
    const diasRetraso = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    
    return diasRetraso;
};

/**
 * Verificar si el préstamo está vencido
 * 
 * Uso: if (prestamo.estaVencido()) { ... }
 */
Prestamo.prototype.estaVencido = function() {
    return this.calcularDiasRetraso() > 0;
};

/**
 * Obtener información completa del préstamo
 */
Prestamo.prototype.getInfoCompleta = async function() {
    await this.reload({
        include: [
            { model: Usuario, as: 'usuario' },
            { model: Ejemplar, as: 'ejemplar' },
            { model: Usuario, as: 'bibliotecario' },
            { model: EstadoPrestamo, as: 'estado' }
        ]
    });
    
    return {
        id: this.id,
        usuario: this.usuario ? this.usuario.nombre : null,
        ejemplar: this.ejemplar ? this.ejemplar.codigo_ejemplar : null,
        bibliotecario: this.bibliotecario ? this.bibliotecario.nombre : null,
        estado: this.estado ? this.estado.nombre : null,
        fecha_prestamo: this.fecha_prestamo,
        fecha_devolucion_estimada: this.fecha_devolucion_estimada,
        dias_retraso: this.calcularDiasRetraso(),
        esta_vencido: this.estaVencido()
    };
};


// MÉTODOS ESTÁTICOS

/**
 * Obtener préstamos activos de un usuario
 */
Prestamo.obtenerActivosDeUsuario = async function(usuarioId) {
    const estadoActivo = await EstadoPrestamo.findOne({
        where: { nombre: 'Activo' }
    });
    
    if (!estadoActivo) {
        return [];
    }
    
    return await this.findAll({
        where: {
            usuario_id: usuarioId,
            estado_id: estadoActivo.id
        },
        include: [
            { model: Ejemplar, as: 'ejemplar' },
            { model: EstadoPrestamo, as: 'estado' }
        ],
        order: [['fecha_prestamo', 'DESC']]
    });
};

/**
 * Obtener préstamos vencidos
 */
Prestamo.obtenerVencidos = async function() {
    const { Op } = require('sequelize');
    const estadoActivo = await EstadoPrestamo.findOne({
        where: { nombre: 'Activo' }
    });
    
    if (!estadoActivo) {
        return [];
    }
    
    const hoy = new Date();
    
    return await this.findAll({
        where: {
            estado_id: estadoActivo.id,
            fecha_devolucion_estimada: {
                [Op.lt]: hoy  // Menor que hoy (fecha pasada)
            }
        },
        include: [
            { model: Usuario, as: 'usuario' },
            { model: Ejemplar, as: 'ejemplar' },
            { model: EstadoPrestamo, as: 'estado' }
        ],
        order: [['fecha_devolucion_estimada', 'ASC']]
    });
};

module.exports = Prestamo;