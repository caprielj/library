// Controlador de Editoriales
const Editorial = require('../models/editorial.model');

// Obtener todas
exports.getAll = async (req, res) => {
    try {
        const editoriales = await Editorial.findAll({
            order: [['nombre', 'ASC']]
        });
        res.json(editoriales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const editorial = await Editorial.findByPk(req.params.id);

        if (!editorial) {
            return res.status(404).json({ error: 'Editorial no encontrada' });
        }

        res.json(editorial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { nombre, pais, descripcion } = req.body;

        const nuevaEditorial = await Editorial.create({
            nombre,
            pais,
            descripcion
        });

        res.status(201).json(nuevaEditorial);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const editorial = await Editorial.findByPk(req.params.id);

        if (!editorial) {
            return res.status(404).json({ error: 'Editorial no encontrada' });
        }

        await editorial.update(req.body);
        res.json({ mensaje: 'Editorial actualizada', editorial });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const editorial = await Editorial.findByPk(req.params.id);

        if (!editorial) {
            return res.status(404).json({ error: 'Editorial no encontrada' });
        }

        await editorial.destroy();
        res.json({ mensaje: 'Editorial eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
