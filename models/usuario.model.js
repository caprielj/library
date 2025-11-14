// Define la estructura de la tabla Usuarios en la base de datos
// Esta es la tabla más importante ya que gestiona todos los usuarios del sistema

// Importar DataTypes de Sequelize para definir tipos de datos
const { DataTypes } = require('sequelize');

// Importar la conexión a la base de datos
const { sequelize } = require('../db/db');

// Importar el modelo Rol para establecer la relación
const Rol = require('./rol.model');

/**
 * Modelo Usuario
 * 
 * Representa a todos los usuarios del sistema:
 * - Administradores (gestionan todo el sistema)
 * - Bibliotecarios (registran préstamos y devoluciones)
 * - Usuarios regulares (solicitan préstamos de libros)
 */
const Usuario = sequelize.define('Usuario', {
    // ===== CAMPO: id =====
    // Clave primaria auto-incremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del usuario'
    },
    
    // CAMPO: rol_id 
    // Llave foránea que relaciona con la tabla Roles
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del rol asignado al usuario (Administrador, Bibliotecario, Usuario)',
        references: {
            model: 'Roles',    // Nombre de la tabla relacionada
            key: 'id'          // Campo de la tabla Roles
        },
        validate: {
            notNull: {
                msg: 'El rol es obligatorio'
            },
            isInt: {
                msg: 'El rol debe ser un número entero'
            }
        }
    },
    
    // CAMPO: nombre 
    // Nombre completo del usuario
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nombre completo del usuario',
        validate: {
            notEmpty: {
                msg: 'El nombre no puede estar vacío'
            },
            len: {
                args: [2, 100],
                msg: 'El nombre debe tener entre 2 y 100 caracteres'
            }
        }
    },
    
    // CAMPO: email 
    // Correo electrónico único para cada usuario
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: {
            name: 'email_unique',
            msg: 'Este email ya está registrado'
        },
        comment: 'Correo electrónico único del usuario',
        validate: {
            notEmpty: {
                msg: 'El email no puede estar vacío'
            },
            isEmail: {
                msg: 'Debe ser un email válido (ejemplo@dominio.com)'
            },
            len: {
                args: [5, 150],
                msg: 'El email debe tener entre 5 y 150 caracteres'
            }
        }
    },
    
    // CAMPO: password 
    // Contraseña encriptada con bcrypt
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Contraseña encriptada con bcrypt (NO guardar texto plano)',
        validate: {
            notEmpty: {
                msg: 'La contraseña no puede estar vacía'
            },
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    
    // CAMPO: telefono 
    // Número de teléfono (opcional)
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Número de teléfono del usuario',
        validate: {
            is: {
                args: /^[0-9+\-\s()]*$/,
                msg: 'El teléfono solo puede contener números y símbolos +, -, (), espacios'
            },
            len: {
                args: [8, 20],
                msg: 'El teléfono debe tener entre 8 y 20 caracteres'
            }
        }
    },
    
    // CAMPO: direccion 
    // Dirección física del usuario (opcional)
    direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Dirección física del usuario'
    },
    
    // CAMPO: fecha_nacimiento
    // Fecha de nacimiento (opcional)
    fecha_nacimiento: {
        type: DataTypes.DATEONLY,  // Solo fecha, sin hora
        allowNull: true,
        comment: 'Fecha de nacimiento del usuario',
        validate: {
            isDate: {
                msg: 'Debe ser una fecha válida'
            },
            // Validar que la persona tenga al menos 5 años
            esMayorDeCincoAnios(value) {
                if (value) {
                    const hoy = new Date();
                    const fechaNac = new Date(value);
                    const edad = hoy.getFullYear() - fechaNac.getFullYear();
                    
                    if (edad < 5) {
                        throw new Error('El usuario debe tener al menos 5 años');
                    }
                }
            }
        }
    },
    
    // ===== CAMPO: numero_carnet =====
    // Número de carnet único para miembros de la biblioteca
    numero_carnet: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: {
            name: 'numero_carnet_unique',
            msg: 'Este número de carnet ya está registrado'
        },
        comment: 'Número de carnet único para miembros activos',
        validate: {
            len: {
                args: [3, 50],
                msg: 'El número de carnet debe tener entre 3 y 50 caracteres'
            }
        }
    },
    
    // CAMPO: fecha_membresia
    // Fecha en que se hizo miembro de la biblioteca
    fecha_membresia: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha de inicio de membresía en la biblioteca',
        validate: {
            isDate: {
                msg: 'Debe ser una fecha válida'
            }
        }
    },
    
    //  CAMPO: estado 
    // Indica si el usuario está activo (1) o inactivo (0)
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Activo (puede usar el sistema), 0=Inactivo (bloqueado)',
        validate: {
            isIn: {
                args: [[0, 1]],
                msg: 'El estado debe ser 0 (inactivo) o 1 (activo)'
            }
        }
    },
    
    // CAMPOS DE TIMESTAMP 
    // Fechas de creación y actualización del registro
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de creación del usuario'
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Fecha y hora de última actualización'
    }
}, {
    // CONFIGURACIÓN DEL MODELO 
    tableName: 'Usuarios',        // Nombre exacto de la tabla en la BD
    timestamps: true,              // Usar timestamps automáticos
    createdAt: 'created_at',      // Mapear createdAt a created_at
    updatedAt: 'updated_at',      // Mapear updatedAt a updated_at
    underscored: false,            // No usar snake_case automático
    
    // HOOKS (Eventos del modelo) 
    // Los hooks se ejecutan automáticamente en ciertos momentos
    hooks: {
        // Hook que se ejecuta ANTES de crear un usuario
        // Útil para encriptar la contraseña antes de guardarla
        beforeCreate: async (usuario) => {
            // La encriptación de contraseña se hará en el controlador
            // Este hook está aquí como referencia para futuras validaciones
            console.log('🔹 Creando nuevo usuario:', usuario.email);
        },
        
        // Hook que se ejecuta ANTES de actualizar un usuario
        beforeUpdate: async (usuario) => {
            console.log('🔹 Actualizando usuario:', usuario.email);
        }
    },
    
    // ÍNDICES 
    // Mejoran el rendimiento de las búsquedas
    indexes: [
        {
            // Índice en el campo email para búsquedas rápidas
            name: 'idx_usuarios_email',
            fields: ['email']
        },
        {
            // Índice en el campo numero_carnet
            name: 'idx_usuarios_numero_carnet',
            fields: ['numero_carnet']
        },
        {
            // Índice en el campo rol_id para las relaciones
            name: 'idx_usuarios_rol',
            fields: ['rol_id']
        }
    ]
});

// DEFINIR RELACIONES (ASOCIACIONES)

/**
 * Relación: Usuario pertenece a un Rol (Many-to-One)
 * 
 * Explicación:
 * - Muchos usuarios pueden tener el mismo rol
 * - Un usuario solo puede tener UN rol
 * 
 * Esto permite hacer queries como:
 * Usuario.findOne({ include: Rol })
 * Para obtener el usuario junto con su información de rol
 */
Usuario.belongsTo(Rol, {
    foreignKey: 'rol_id',     // Llave foránea en la tabla Usuarios
    as: 'rol',                // Alias para acceder: usuario.rol
    onDelete: 'RESTRICT',     // No permitir borrar un rol si tiene usuarios
    onUpdate: 'CASCADE'       // Si se actualiza el ID del rol, actualizar también aquí
});

/**
 * Relación inversa: Rol tiene muchos Usuarios (One-to-Many)
 * 
 * Esto permite hacer queries como:
 * Rol.findOne({ include: Usuario })
 * Para obtener un rol junto con todos sus usuarios
 */
Rol.hasMany(Usuario, {
    foreignKey: 'rol_id',     // Llave foránea en la tabla Usuarios
    as: 'usuarios',           // Alias para acceder: rol.usuarios
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// MÉTODOS DE INSTANCIA

/**
 * Método para excluir la contraseña al convertir a JSON
 * 
 * Uso: usuario.toJSON() - NO incluirá el campo password
 * 
 * Esto es útil cuando devolvemos usuarios al frontend
 * para que nunca se envíe la contraseña (ni encriptada)
 */
Usuario.prototype.toJSON = function() {
    const values = { ...this.get() };
    
    // Eliminar el campo password del objeto
    delete values.password;
    
    return values;
};

/**
 * Método para obtener el nombre del rol del usuario
 * 
 * Uso: await usuario.getNombreRol()
 * Retorna: "Administrador", "Bibliotecario", etc.
 */
Usuario.prototype.getNombreRol = async function() {
    const rol = await this.getRol();
    return rol ? rol.nombre : null;
};

/**
 * Método para verificar si el usuario es administrador
 * 
 * Uso: if (usuario.esAdministrador()) { ... }
 * Retorna: true o false
 */
Usuario.prototype.esAdministrador = async function() {
    const nombreRol = await this.getNombreRol();
    return nombreRol === 'Administrador';
};

/**
 * Método para verificar si el usuario es bibliotecario
 */
Usuario.prototype.esBibliotecario = async function() {
    const nombreRol = await this.getNombreRol();
    return nombreRol === 'Bibliotecario';
};


// MÉTODOS ESTÁTICOS (de la clase, no de instancias)

/**
 * Buscar usuario por email
 * 
 * Uso: const usuario = await Usuario.buscarPorEmail('juan@example.com');
 */
Usuario.buscarPorEmail = async function(email) {
    return await this.findOne({
        where: { email },
        include: [{
            model: Rol,
            as: 'rol'
        }]
    });
};

/**
 * Buscar usuario por número de carnet
 * 
 * Uso: const usuario = await Usuario.buscarPorCarnet('BIB-2024-001');
 */
Usuario.buscarPorCarnet = async function(numeroCarnet) {
    return await this.findOne({
        where: { numero_carnet: numeroCarnet },
        include: [{
            model: Rol,
            as: 'rol'
        }]
    });
};

/**
 * Obtener todos los usuarios activos
 * 
 * Uso: const activos = await Usuario.obtenerActivos();
 */
Usuario.obtenerActivos = async function() {
    return await this.findAll({
        where: { estado: 1 },
        include: [{
            model: Rol,
            as: 'rol'
        }],
        order: [['nombre', 'ASC']]
    });
};

// Exportar el modelo para usarlo en controladores
module.exports = Usuario;