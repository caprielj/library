// Controlador de Ubicaciones
const Ubicacion = require('../models/ubicacion.model');

// Obtener todas
exports.getAll = async (req, res) => {
    try {
        const ubicaciones = await Ubicacion.findAll({
            order: [['seccion', 'ASC'], ['estante', 'ASC']]
        });
        res.json(ubicaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const ubicacion = await Ubicacion.findByPk(req.params.id);

        if (!ubicacion) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }

        res.json(ubicacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { seccion, estante, nivel, descripcion } = req.body;

        const nuevaUbicacion = await Ubicacion.create({
            seccion,
            estante,
            nivel,
            descripcion
        });

        res.status(201).json(nuevaUbicacion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const ubicacion = await Ubicacion.findByPk(req.params.id);

        if (!ubicacion) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }

        await ubicacion.update(req.body);
        res.json({ mensaje: 'Ubicación actualizada', ubicacion });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const ubicacion = await Ubicacion.findByPk(req.params.id);

        if (!ubicacion) {
            return res.status(404).json({ error: 'Ubicación no encontrada' });
        }

        await ubicacion.destroy();
        res.json({ mensaje: 'Ubicación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
