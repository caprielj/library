// Control de acceso granular por rol y módulo

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

// Importar modelo de Rol
const Rol = require('./rol.model');

/**
 * Modelo Permiso
 * 
 * Define qué puede hacer cada rol en cada módulo:
 * - Crear (POST)
 * - Leer (GET)
 * - Actualizar (PUT)
 * - Eliminar (DELETE)
 * 
 * Ejemplo:
 * - Rol "Usuario" puede LEER libros pero NO crear/actualizar/eliminar
 * - Rol "Bibliotecario" puede TODO en préstamos
 * - Rol "Administrador" puede TODO en todos los módulos
 */
const Permiso = sequelize.define('Permiso', {
    // CAMPO: id 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único del permiso'
    },
    
    // CAMPO: rol_id 
    // Relaciona con la tabla Roles
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del rol al que se asigna el permiso',
        references: {
            model: 'Roles',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El rol es obligatorio'
            }
        }
    },
    
    // CAMPO: modulo 
    // Módulo del sistema (libros, usuarios, prestamos, etc)
    modulo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Módulo del sistema (libros, usuarios, prestamos, etc)',
        validate: {
            notEmpty: {
                msg: 'El módulo no puede estar vacío'
            },
            isIn: {
                args: [[
                    'usuarios',
                    'roles',
                    'autores',
                    'editoriales',
                    'categorias',
                    'idiomas',
                    'libros',
                    'ubicaciones',
                    'ejemplares',
                    'prestamos',
                    'devoluciones',
                    'multas',
                    'permisos'
                ]],
                msg: 'Módulo inválido'
            }
        }
    },
    
    // CAMPO: puede_crear
    // Permiso para crear registros (POST)
    puede_crear: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Permiso para crear registros (POST)'
    },
    
    // CAMPO: puede_leer 
    // Permiso para leer registros (GET)
    puede_leer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Permiso para leer registros (GET)'
    },
    
    // CAMPO: puede_actualizar
    // Permiso para actualizar registros (PUT)
    puede_actualizar: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Permiso para actualizar registros (PUT)'
    },
    
    // CAMPO: puede_eliminar 
    // Permiso para eliminar registros (DELETE)
    puede_eliminar: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Permiso para eliminar registros (DELETE)'
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
    tableName: 'Permisos',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
    // Índice único: un rol solo puede tener UN permiso por módulo
    indexes: [
        {
            unique: true,
            fields: ['rol_id', 'modulo']
        }
    ]
});


// RELACIONES

/**
 * Relación: Permiso pertenece a un Rol
 */
Permiso.belongsTo(Rol, {
    foreignKey: 'rol_id',
    as: 'rol',
    onDelete: 'CASCADE',  // Si se borra el rol, se borran sus permisos
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Rol tiene muchos Permisos
 */
Rol.hasMany(Permiso, {
    foreignKey: 'rol_id',
    as: 'permisos',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


// MÉTODOS DE INSTANCIA=

/**
 * Verificar si tiene permiso completo (CRUD completo)
 */
Permiso.prototype.tieneAccesoCompleto = function() {
    return this.puede_crear && 
           this.puede_leer && 
           this.puede_actualizar && 
           this.puede_eliminar;
};

/**
 * Verificar si tiene acceso de solo lectura
 */
Permiso.prototype.esSoloLectura = function() {
    return this.puede_leer && 
           !this.puede_crear && 
           !this.puede_actualizar && 
           !this.puede_eliminar;
};


// MÉTODOS ESTÁTICOS

/**
 * Obtener permisos de un rol específico
 * 
 * Uso: const permisos = await Permiso.obtenerDeRol(1);
 */
Permiso.obtenerDeRol = async function(rolId) {
    return await this.findAll({
        where: { rol_id: rolId },
        include: [{
            model: Rol,
            as: 'rol'
        }],
        order: [['modulo', 'ASC']]
    });
};

/**
 * Verificar si un rol tiene permiso para una acción en un módulo
 * 
 * Uso: const puede = await Permiso.verificarPermiso(rolId, 'libros', 'crear');
 * Retorna: true o false
 */
Permiso.verificarPermiso = async function(rolId, modulo, accion) {
    const permiso = await this.findOne({
        where: {
            rol_id: rolId,
            modulo: modulo
        }
    });
    
    if (!permiso) {
        return false;
    }
    
    // Verificar según la acción
    switch(accion.toLowerCase()) {
        case 'crear':
        case 'create':
        case 'post':
            return permiso.puede_crear;
            
        case 'leer':
        case 'read':
        case 'get':
            return permiso.puede_leer;
            
        case 'actualizar':
        case 'update':
        case 'put':
            return permiso.puede_actualizar;
            
        case 'eliminar':
        case 'delete':
            return permiso.puede_eliminar;
            
        default:
            return false;
    }
};

/**
 * Crear permisos por defecto para un rol
 * 
 * Uso: await Permiso.crearPorDefecto(rolId, 'Usuario');
 */
Permiso.crearPorDefecto = async function(rolId, nombreRol) {
    const modulos = [
        'usuarios', 'roles', 'autores', 'editoriales', 
        'categorias', 'idiomas', 'libros', 'ubicaciones',
        'ejemplares', 'prestamos', 'devoluciones', 'multas', 'permisos'
    ];
    
    const permisosCreados = [];
    
    for (const modulo of modulos) {
        let permisos = {};
        
        // Definir permisos según el rol
        if (nombreRol === 'Administrador') {
            // Administrador: acceso total a todo
            permisos = {
                puede_crear: true,
                puede_leer: true,
                puede_actualizar: true,
                puede_eliminar: true
            };
        } else if (nombreRol === 'Bibliotecario') {
            // Bibliotecario: puede hacer todo excepto gestionar roles y permisos
            if (modulo === 'roles' || modulo === 'permisos') {
                permisos = {
                    puede_crear: false,
                    puede_leer: true,
                    puede_actualizar: false,
                    puede_eliminar: false
                };
            } else {
                permisos = {
                    puede_crear: true,
                    puede_leer: true,
                    puede_actualizar: true,
                    puede_eliminar: false
                };
            }
        } else if (nombreRol === 'Usuario') {
            // Usuario regular: solo lectura en catálogo y ver sus propios préstamos
            if (modulo === 'libros' || modulo === 'autores' || 
                modulo === 'editoriales' || modulo === 'categorias' || 
                modulo === 'idiomas') {
                permisos = {
                    puede_crear: false,
                    puede_leer: true,
                    puede_actualizar: false,
                    puede_eliminar: false
                };
            } else if (modulo === 'prestamos') {
                // Puede ver sus préstamos pero no crear directamente
                permisos = {
                    puede_crear: false,
                    puede_leer: true,
                    puede_actualizar: false,
                    puede_eliminar: false
                };
            } else {
                // Sin acceso a otros módulos
                permisos = {
                    puede_crear: false,
                    puede_leer: false,
                    puede_actualizar: false,
                    puede_eliminar: false
                };
            }
        }
        
        // Crear el permiso
        const permisoCreado = await this.create({
            rol_id: rolId,
            modulo: modulo,
            ...permisos
        });
        
        permisosCreados.push(permisoCreado);
    }
    
    return permisosCreados;
};

module.exports = Permiso;