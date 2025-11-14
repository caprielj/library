// Controlador de Categorías
const Categoria = require('../models/categoria.model');

// Obtener todas
exports.getAll = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            order: [['nombre', 'ASC']]
        });
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        res.json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const nuevaCategoria = await Categoria.create({
            nombre,
            descripcion
        });

        res.status(201).json(nuevaCategoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await categoria.update(req.body);
        res.json({ mensaje: 'Categoría actualizada', categoria });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id);

        if (!categoria) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await categoria.destroy();
        res.json({ mensaje: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
