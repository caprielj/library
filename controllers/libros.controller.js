// Controlador de Libros
const { Op } = require('sequelize');
const Libro = require('../models/libro.model');
const Autor = require('../models/autor.model');
const Editorial = require('../models/editorial.model');
const Categoria = require('../models/categoria.model');
const Idioma = require('../models/idioma.model');

// Obtener todos los libros
exports.getAll = async (req, res) => {
    try {
        const libros = await Libro.findAll({
            include: [
                { model: Autor, as: 'autor' },
                { model: Editorial, as: 'editorial' },
                { model: Categoria, as: 'categoria' },
                { model: Idioma, as: 'idioma' }
            ],
            order: [['titulo', 'ASC']]
        });
        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const libro = await Libro.findByPk(req.params.id, {
            include: [
                { model: Autor, as: 'autor' },
                { model: Editorial, as: 'editorial' },
                { model: Categoria, as: 'categoria' },
                { model: Idioma, as: 'idioma' }
            ]
        });

        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json(libro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Buscar por título
exports.buscar = async (req, res) => {
    try {
        const { titulo } = req.query;

        if (!titulo) {
            return res.status(400).json({ error: 'Parámetro titulo requerido' });
        }

        const libros = await Libro.findAll({
            where: {
                titulo: { [Op.like]: `%${titulo}%` }
            },
            include: [
                { model: Autor, as: 'autor' },
                { model: Editorial, as: 'editorial' },
                { model: Categoria, as: 'categoria' },
                { model: Idioma, as: 'idioma' }
            ],
            order: [['titulo', 'ASC']]
        });

        res.json(libros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { isbn, titulo, autor_id, editorial_id, categoria_id, idioma_id, anio_publicacion, numero_paginas, descripcion } = req.body;

        const nuevoLibro = await Libro.create({
            isbn,
            titulo,
            autor_id,
            editorial_id,
            categoria_id,
            idioma_id,
            anio_publicacion,
            numero_paginas,
            descripcion
        });

        res.status(201).json(nuevoLibro);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const libro = await Libro.findByPk(req.params.id);

        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        await libro.update(req.body);
        res.json({ mensaje: 'Libro actualizado', libro });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const libro = await Libro.findByPk(req.params.id);

        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        await libro.destroy();
        res.json({ mensaje: 'Libro eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
