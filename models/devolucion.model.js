// Registra las devoluciones de libros prestados

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Importar modelos relacionados
const Prestamo = require('./prestamo.model');
const Usuario = require('./usuario.model');

/**
 * Modelo Devolucion
 * 
 * Registra cuando un usuario devuelve un libro:
 * - Préstamo asociado
 * - Fecha real de devolución
 * - Bibliotecario que recibe
 * - Días de retraso
 * - Condición del libro al devolverlo
 */
const Devolucion = sequelize.define('Devolucion', {
    // CAMPO: id
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único de la devolución'
    },
    
    // CAMPO: prestamo_id 
    // Relación con el préstamo que se está devolviendo
    prestamo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
            name: 'prestamo_id_unique',
            msg: 'Este préstamo ya tiene una devolución registrada'
        },
        comment: 'ID del préstamo que se está devolviendo',
        references: {
            model: 'Prestamos',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El préstamo es obligatorio'
            }
        }
    },
    
    // CAMPO: fecha_devolucion_real
    // Fecha en que realmente se devolvió el libro
    fecha_devolucion_real: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Fecha en que se devolvió realmente el libro',
        validate: {
            notNull: {
                msg: 'La fecha de devolución es obligatoria'
            },
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    
    // CAMPO: bibliotecario_id
    // Bibliotecario que recibe la devolución
    bibliotecario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del bibliotecario que recibe la devolución',
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
    
    // CAMPO: dias_retraso
    // Cantidad de días de retraso (calculado automáticamente)
    dias_retraso: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Cambiado a true para que el hook lo pueda calcular
        defaultValue: 0,
        comment: 'Días de retraso calculados (calculado automáticamente por hook)'
        // Sin validación - el hook garantiza que siempre sea >= 0
    },
    
    // CAMPO: condicion_devolucion 
    // Estado del libro al ser devuelto
    condicion_devolucion: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Estado del libro al devolverlo (Bueno, Regular, Dañado)',
        validate: {
            isIn: {
                args: [['Bueno', 'Regular', 'Dañado', 'Extraviado']],
                msg: 'La condición debe ser: Bueno, Regular, Dañado o Extraviado'
            }
        }
    },
    
    // CAMPO: observaciones
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Observaciones de la devolución (daños, páginas rotas, etc)'
    },
    
    // TIMESTAMPS 
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de registro de la devolución'
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Devoluciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
    // Índices
    indexes: [
        {
            name: 'idx_devoluciones_prestamo',
            fields: ['prestamo_id']
        },
        {
            name: 'idx_devoluciones_fecha',
            fields: ['fecha_devolucion_real']
        }
    ]
});


// RELACIONES

/**
 * Relación: Devolución pertenece a un Préstamo
 * Relación 1:1 (un préstamo solo puede tener una devolución)
 */
Devolucion.belongsTo(Prestamo, {
    foreignKey: 'prestamo_id',
    as: 'prestamo',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Préstamo tiene una Devolución
 */
Prestamo.hasOne(Devolucion, {
    foreignKey: 'prestamo_id',
    as: 'devolucion',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Devolución pertenece a un Bibliotecario (Usuario)
 */
Devolucion.belongsTo(Usuario, {
    foreignKey: 'bibliotecario_id',
    as: 'bibliotecario',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Usuario tiene muchas Devoluciones (como bibliotecario)
 */
Usuario.hasMany(Devolucion, {
    foreignKey: 'bibliotecario_id',
    as: 'devoluciones_recibidas',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});


// HOOKS (Eventos automáticos)

/**
 * Hook: Antes de validar una devolución (se ejecuta ANTES de las validaciones)
 * Calcula automáticamente los días de retraso
 */
Devolucion.beforeValidate(async (devolucion) => {
    // Solo calcular si es una nueva devolución y tiene prestamo_id
    if (devolucion.isNewRecord && devolucion.prestamo_id) {
        // Obtener el préstamo relacionado
        const prestamo = await Prestamo.findByPk(devolucion.prestamo_id);

        if (prestamo) {
            // Convertir fechas a strings YYYY-MM-DD si no lo están ya
            const fechaRealStr = typeof devolucion.fecha_devolucion_real === 'string'
                ? devolucion.fecha_devolucion_real
                : devolucion.fecha_devolucion_real.toISOString().split('T')[0];

            const fechaEstimadaStr = typeof prestamo.fecha_devolucion_estimada === 'string'
                ? prestamo.fecha_devolucion_estimada
                : prestamo.fecha_devolucion_estimada.toISOString().split('T')[0];

            // Calcular días de retraso usando solo las fechas sin tiempo
            const fechaDevolucionReal = new Date(fechaRealStr);
            const fechaDevolucionEstimada = new Date(fechaEstimadaStr);

            // Calcular diferencia en días
            const diferenciaMilisegundos = fechaDevolucionReal - fechaDevolucionEstimada;
            const diasDiferencia = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

            // Si la diferencia es positiva, hay retraso; si no, es 0
            devolucion.dias_retraso = Math.max(0, diasDiferencia);

            console.log(`📚 Calculando devolución: fecha_real=${fechaRealStr}, fecha_estimada=${fechaEstimadaStr}, días_retraso=${devolucion.dias_retraso}`);
        } else {
            // Si no encuentra el préstamo, establecer 0
            devolucion.dias_retraso = 0;
        }
    }
});


// MÉTODOS DE INSTANCIA

/**
 * Verificar si la devolución tiene retraso
 */
Devolucion.prototype.tieneRetraso = function() {
    return this.dias_retraso > 0;
};

/**
 * Calcular monto de multa por retraso
 * Asume Q5.00 por día de retraso
 */
Devolucion.prototype.calcularMontoMulta = function() {
    const MULTA_POR_DIA = 5.00; // Q5.00 por día
    return this.dias_retraso * MULTA_POR_DIA;
};


// MÉTODOS ESTÁTICOS

/**
 * Obtener devoluciones con retraso
 */
Devolucion.obtenerConRetraso = async function() {
    const { Op } = require('sequelize');
    
    return await this.findAll({
        where: {
            dias_retraso: {
                [Op.gt]: 0  // Mayor que 0
            }
        },
        include: [
            {
                model: Prestamo,
                as: 'prestamo',
                include: [
                    { model: Usuario, as: 'usuario' }
                ]
            },
            { model: Usuario, as: 'bibliotecario' }
        ],
        order: [['dias_retraso', 'DESC']]
    });
};

module.exports = Devolucion;