// Gestiona las multas por retraso o daños en los libros

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Importar modelos relacionados
const Devolucion = require('./devolucion.model');
const Usuario = require('./usuario.model');

/**
 * Modelo Multa
 * 
 * Registra multas generadas por:
 * - Retraso en la devolución
 * - Daños al libro
 * - Pérdida del libro
 */
const Multa = sequelize.define('Multa', {
    // CAMPO: id 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único de la multa'
    },
    
    // CAMPO: devolucion_id 
    // Relación con la devolución que generó la multa
    devolucion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID de la devolución que generó la multa',
        references: {
            model: 'Devoluciones',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'La devolución es obligatoria'
            }
        }
    },
    
    // CAMPO: usuario_id
    // Usuario que recibe la multa
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del usuario multado',
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
    
    // CAMPO: tipo_multa 
    // Tipo de multa (Retraso, Daño, Pérdida)
    tipo_multa: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Tipo de multa (Retraso, Daño, Pérdida)',
        validate: {
            notEmpty: {
                msg: 'El tipo de multa no puede estar vacío'
            },
            isIn: {
                args: [['Retraso', 'Daño', 'Pérdida']],
                msg: 'El tipo debe ser: Retraso, Daño o Pérdida'
            }
        }
    },
    
    // CAMPO: monto
    // Monto de la multa en Quetzales
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Monto de la multa en Quetzales (Q)',
        validate: {
            notNull: {
                msg: 'El monto es obligatorio'
            },
            isDecimal: {
                msg: 'El monto debe ser un número válido'
            }
        }
    },
    
    // CAMPO: descripcion
    // Descripción detallada de la multa
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada de la multa'
    },
    
    // CAMPO: pagada 
    // Indica si la multa fue pagada
    pagada: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indica si la multa fue pagada (true) o está pendiente (false)'
    },
    
    // CAMPO: fecha_pago 
    // Fecha en que se pagó la multa
    fecha_pago: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha en que se pagó la multa',
        validate: {
            isDate: {
                msg: 'Debe ser una fecha válida'
            },
            // Validar que la fecha de pago no sea futura
            noEsFutura(value) {
                if (value) {
                    const hoy = new Date();
                    const fechaPago = new Date(value);
                    
                    if (fechaPago > hoy) {
                        throw new Error('La fecha de pago no puede ser futura');
                    }
                }
            }
        }
    },

    // TIMESTAMPS 
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha de creación de la multa'
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Multas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
    // Índices
    indexes: [
        {
            name: 'idx_multas_usuario',
            fields: ['usuario_id']
        },
        {
            name: 'idx_multas_devolucion',
            fields: ['devolucion_id']
        },
        {
            name: 'idx_multas_pagada',
            fields: ['pagada']
        }
    ]
});


// RELACIONES

/**
 * Relación: Multa pertenece a una Devolución
 */
Multa.belongsTo(Devolucion, {
    foreignKey: 'devolucion_id',
    as: 'devolucion',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Devolución puede tener muchas Multas
 * (por ejemplo, una multa por retraso y otra por daño)
 */
Devolucion.hasMany(Multa, {
    foreignKey: 'devolucion_id',
    as: 'multas',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Multa pertenece a un Usuario
 */
Multa.belongsTo(Usuario, {
    foreignKey: 'usuario_id',
    as: 'usuario',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Usuario tiene muchas Multas
 */
Usuario.hasMany(Multa, {
    foreignKey: 'usuario_id',
    as: 'multas',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});


// HOOKS

/**
 * Hook: Antes de actualizar una multa
 * Si se marca como pagada, registrar la fecha de pago
 */
Multa.beforeUpdate(async (multa) => {
    // Si se está marcando como pagada y no tiene fecha de pago
    if (multa.pagada && !multa.fecha_pago) {
        multa.fecha_pago = new Date();
        console.log(`💰 Multa #${multa.id} marcada como pagada`);
    }
    
    // Si se está marcando como NO pagada, limpiar la fecha
    if (!multa.pagada && multa.fecha_pago) {
        multa.fecha_pago = null;
    }
});


// MÉTODOS DE INSTANCIA

/**
 * Marcar multa como pagada
 * 
 * Uso: await multa.marcarComoPagada();
 */
Multa.prototype.marcarComoPagada = async function() {
    this.pagada = true;
    this.fecha_pago = new Date();
    await this.save();
    
    return this;
};

/**
 * Verificar si está vencida (más de 30 días sin pagar)
 */
Multa.prototype.estaVencida = function() {
    if (this.pagada) {
        return false;
    }
    
    const hoy = new Date();
    const fechaCreacion = new Date(this.created_at);
    const diasDesdeCreacion = Math.floor((hoy - fechaCreacion) / (1000 * 60 * 60 * 24));
    
    return diasDesdeCreacion > 30;
};


// MÉTODOS ESTÁTICOS

/**
 * Obtener multas pendientes de un usuario
 */
Multa.obtenerPendientesDeUsuario = async function(usuarioId) {
    return await this.findAll({
        where: {
            usuario_id: usuarioId,
            pagada: false
        },
        include: [
            {
                model: Devolucion,
                as: 'devolucion',
                include: [
                    { model: Prestamo, as: 'prestamo' }
                ]
            }
        ],
        order: [['created_at', 'DESC']]
    });
};

/**
 * Calcular total adeudado por un usuario
 */
Multa.calcularTotalAdeudado = async function(usuarioId) {
    const multas = await this.obtenerPendientesDeUsuario(usuarioId);
    
    let total = 0;
    multas.forEach(multa => {
        total += parseFloat(multa.monto);
    });
    
    return total;
};

/**
 * Obtener todas las multas pendientes (de todos los usuarios)
 */
Multa.obtenerTodasPendientes = async function() {
    return await this.findAll({
        where: {
            pagada: false
        },
        include: [
            { model: Usuario, as: 'usuario' },
            { model: Devolucion, as: 'devolucion' }
        ],
        order: [['created_at', 'DESC']]
    });
};

module.exports = Multa;