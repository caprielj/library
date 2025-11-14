// Define la estructura de la tabla Libros (catálogo principal)
// Este es uno de los modelos más importantes del sistema

// Importar DataTypes de Sequelize para definir tipos de datos
const { DataTypes } = require('sequelize');

// Importar la conexión a la base de datos
const { sequelize } = require('../db/db');

// Importar los modelos relacionados para establecer las asociaciones
const Autor = require('./autor.model');
const Editorial = require('./editorial.model');
const Categoria = require('./categoria.model');
const Idioma = require('./idioma.model');

/**
 * Modelo Libro
 * 
 * Representa el catálogo principal de libros de la biblioteca:
 * - Información del libro (título, ISBN, descripción)
 * - Relaciones con: Autor, Editorial, Categoría, Idioma
 * - Datos de publicación
 */
const Libro = sequelize.define('Libro', {
    // CAMPO: id
    // Clave primaria auto-incremental
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del libro'
    },
    
    // CAMPO: isbn
    // Código ISBN único del libro (International Standard Book Number)
    isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: {
            name: 'isbn_unique',
            msg: 'Este ISBN ya está registrado'
        },
        comment: 'Código ISBN único del libro (978-3-16-148410-0)',
        validate: {
            notEmpty: {
                msg: 'El ISBN no puede estar vacío'
            },
            len: {
                args: [10, 20],
                msg: 'El ISBN debe tener entre 10 y 20 caracteres'
            }
        }
    },
    
    // CAMPO: titulo 
    // Título del libro
    titulo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Título del libro',
        validate: {
            notEmpty: {
                msg: 'El título no puede estar vacío'
            },
            len: {
                args: [1, 255],
                msg: 'El título debe tener entre 1 y 255 caracteres'
            }
        }
    },
    
    // CAMPO: autor_id 
    // Llave foránea que relaciona con la tabla Autores
    autor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del autor del libro',
        references: {
            model: 'Autores',    // Nombre de la tabla relacionada
            key: 'id'            // Campo de la tabla Autores
        },
        validate: {
            notNull: {
                msg: 'El autor es obligatorio'
            },
            isInt: {
                msg: 'El ID del autor debe ser un número entero'
            }
        }
    },
    
    // CAMPO: editorial_id 
    // Llave foránea que relaciona con la tabla Editoriales
    editorial_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID de la editorial del libro',
        references: {
            model: 'Editoriales',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'La editorial es obligatoria'
            },
            isInt: {
                msg: 'El ID de la editorial debe ser un número entero'
            }
        }
    },
    
    // CAMPO: categoria_id 
    // Llave foránea que relaciona con la tabla Categorias
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID de la categoría del libro',
        references: {
            model: 'Categorias',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'La categoría es obligatoria'
            },
            isInt: {
                msg: 'El ID de la categoría debe ser un número entero'
            }
        }
    },
    
    // CAMPO: idioma_id 
    // Llave foránea que relaciona con la tabla Idiomas
    idioma_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID del idioma del libro',
        references: {
            model: 'Idiomas',
            key: 'id'
        },
        validate: {
            notNull: {
                msg: 'El idioma es obligatorio'
            },
            isInt: {
                msg: 'El ID del idioma debe ser un número entero'
            }
        }
    },
    
    // CAMPO: anio_publicacion 
    // Año en que se publicó el libro
    anio_publicacion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Año de publicación del libro',
        validate: {
            isInt: {
                msg: 'El año debe ser un número entero'
            },
            min: {
                args: 1000,
                msg: 'El año debe ser mayor a 1000'
            },
            max: {
                args: new Date().getFullYear() + 1,
                msg: 'El año no puede ser futuro'
            }
        }
    },
    
    // CAMPO: numero_paginas 
    // Cantidad de páginas del libro
    numero_paginas: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Número de páginas del libro',
        validate: {
            isInt: {
                msg: 'El número de páginas debe ser un entero'
            },
            min: {
                args: 1,
                msg: 'El libro debe tener al menos 1 página'
            }
        }
    },
    
    // CAMPO: descripcion 
    // Sinopsis o descripción del libro
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Sinopsis o descripción del libro'
    },
    
    // CAMPO: imagen_portada 
    // URL de la imagen de la portada del libro
    imagen_portada: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'URL de la imagen de portada del libro',
        validate: {
            isUrl: {
                msg: 'Debe ser una URL válida'
            }
        }
    },
    
    // CAMPO: estado 
    // Indica si el libro está activo en el catálogo
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Activo (en catálogo), 0=Inactivo (fuera de catálogo)',
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
    tableName: 'Libros',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: false,
    
    // ÍNDICES PARA OPTIMIZACIÓN 
    indexes: [
        {
            name: 'idx_libros_isbn',
            fields: ['isbn']
        },
        {
            name: 'idx_libros_titulo',
            fields: ['titulo']
        },
        {
            name: 'idx_libros_autor',
            fields: ['autor_id']
        },
        {
            name: 'idx_libros_categoria',
            fields: ['categoria_id']
        }
    ]
});

// DEFINIR RELACIONES (ASOCIACIONES)

/**
 * Relación: Libro pertenece a un Autor (Many-to-One)
 * 
 * Esto permite:
 * - Obtener el autor de un libro: libro.getAutor()
 * - Incluir autor al buscar libro: Libro.findOne({ include: 'autor' })
 */
Libro.belongsTo(Autor, {
    foreignKey: 'autor_id',     // Campo que conecta las tablas
    as: 'autor',                // Alias para acceder: libro.autor
    onDelete: 'RESTRICT',       // No permitir borrar autor si tiene libros
    onUpdate: 'CASCADE'         // Si se actualiza ID del autor, actualizar aquí
});

/**
 * Relación inversa: Autor tiene muchos Libros (One-to-Many)
 */
Autor.hasMany(Libro, {
    foreignKey: 'autor_id',
    as: 'libros',               // Alias: autor.libros
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Libro pertenece a una Editorial (Many-to-One)
 */
Libro.belongsTo(Editorial, {
    foreignKey: 'editorial_id',
    as: 'editorial',            // Alias: libro.editorial
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Editorial tiene muchos Libros
 */
Editorial.hasMany(Libro, {
    foreignKey: 'editorial_id',
    as: 'libros',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Libro pertenece a una Categoría (Many-to-One)
 */
Libro.belongsTo(Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria',            // Alias: libro.categoria
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Categoría tiene muchos Libros
 */
Categoria.hasMany(Libro, {
    foreignKey: 'categoria_id',
    as: 'libros',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación: Libro pertenece a un Idioma (Many-to-One)
 */
Libro.belongsTo(Idioma, {
    foreignKey: 'idioma_id',
    as: 'idioma',               // Alias: libro.idioma
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

/**
 * Relación inversa: Idioma tiene muchos Libros
 */
Idioma.hasMany(Libro, {
    foreignKey: 'idioma_id',
    as: 'libros',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

// MÉTODOS DE INSTANCIA

/**
 * Método para obtener información completa del libro
 * Incluye: autor, editorial, categoría, idioma
 * 
 * Uso: const infoCompleta = await libro.getInfoCompleta();
 */
Libro.prototype.getInfoCompleta = async function() {
    // Recargar el libro con todas sus relaciones
    await this.reload({
        include: [
            { model: Autor, as: 'autor' },
            { model: Editorial, as: 'editorial' },
            { model: Categoria, as: 'categoria' },
            { model: Idioma, as: 'idioma' }
        ]
    });
    
    return {
        id: this.id,
        isbn: this.isbn,
        titulo: this.titulo,
        autor: this.autor ? this.autor.getNombreCompleto() : null,
        editorial: this.editorial ? this.editorial.nombre : null,
        categoria: this.categoria ? this.categoria.nombre : null,
        idioma: this.idioma ? this.idioma.nombre : null,
        anio_publicacion: this.anio_publicacion,
        numero_paginas: this.numero_paginas,
        descripcion: this.descripcion,
        imagen_portada: this.imagen_portada
    };
};

// MÉTODOS ESTÁTICOS

/**
 * Buscar libro por ISBN
 * 
 * Uso: const libro = await Libro.buscarPorISBN('978-3-16-148410-0');
 */
Libro.buscarPorISBN = async function(isbn) {
    return await this.findOne({
        where: { isbn },
        include: [
            { model: Autor, as: 'autor' },
            { model: Editorial, as: 'editorial' },
            { model: Categoria, as: 'categoria' },
            { model: Idioma, as: 'idioma' }
        ]
    });
};

/**
 * Buscar libros por título (búsqueda parcial)
 * 
 * Uso: const libros = await Libro.buscarPorTitulo('Harry Potter');
 */
Libro.buscarPorTitulo = async function(titulo) {
    const { Op } = require('sequelize');
    
    return await this.findAll({
        where: {
            titulo: {
                [Op.like]: `%${titulo}%`
            }
        },
        include: [
            { model: Autor, as: 'autor' },
            { model: Editorial, as: 'editorial' },
            { model: Categoria, as: 'categoria' },
            { model: Idioma, as: 'idioma' }
        ],
        order: [['titulo', 'ASC']]
    });
};

/**
 * Obtener libros por categoría
 * 
 * Uso: const libros = await Libro.obtenerPorCategoria(1);
 */
Libro.obtenerPorCategoria = async function(categoriaId) {
    return await this.findAll({
        where: { categoria_id: categoriaId, estado: 1 },
        include: [
            { model: Autor, as: 'autor' },
            { model: Editorial, as: 'editorial' },
            { model: Categoria, as: 'categoria' },
            { model: Idioma, as: 'idioma' }
        ],
        order: [['titulo', 'ASC']]
    });
};

// Exportar el modelo para usarlo en controladores
module.exports = Libro;