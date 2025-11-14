// Controlador de Autores
const Autor = require('../models/autor.model');

// Obtener todos
exports.getAll = async (req, res) => {
    try {
        const autores = await Autor.findAll({
            order: [['apellido', 'ASC']]
        });
        res.json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const autor = await Autor.findByPk(req.params.id);

        if (!autor) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }

        res.json(autor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { nombre, apellido, nacionalidad, biografia } = req.body;

        const nuevoAutor = await Autor.create({
            nombre,
            apellido,
            nacionalidad,
            biografia
        });

        res.status(201).json(nuevoAutor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const autor = await Autor.findByPk(req.params.id);

        if (!autor) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }

        await autor.update(req.body);
        res.json({ mensaje: 'Autor actualizado', autor });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const autor = await Autor.findByPk(req.params.id);

        if (!autor) {
            return res.status(404).json({ error: 'Autor no encontrado' });
        }

        await autor.destroy();
        res.json({ mensaje: 'Autor eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
