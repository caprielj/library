// Controlador de Ejemplares
const Ejemplar = require('../models/ejemplar.model');
const Libro = require('../models/libro.model');
const Ubicacion = require('../models/ubicacion.model');
const EstadoEjemplar = require('../models/estadoejemplar.model');

// Obtener todos
exports.getAll = async (req, res) => {
    try {
        const ejemplares = await Ejemplar.findAll({
            include: [
                { model: Libro, as: 'libro' },
                { model: Ubicacion, as: 'ubicacion' },
                { model: EstadoEjemplar, as: 'estado' }
            ],
            order: [['codigo_ejemplar', 'ASC']]
        });
        res.json(ejemplares);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const ejemplar = await Ejemplar.findByPk(req.params.id, {
            include: [
                { model: Libro, as: 'libro' },
                { model: Ubicacion, as: 'ubicacion' },
                { model: EstadoEjemplar, as: 'estado' }
            ]
        });

        if (!ejemplar) {
            return res.status(404).json({ error: 'Ejemplar no encontrado' });
        }

        res.json(ejemplar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { codigo_ejemplar, libro_id, ubicacion_id, estado_id, fecha_adquisicion, observaciones } = req.body;

        const nuevoEjemplar = await Ejemplar.create({
            codigo_ejemplar,
            libro_id,
            ubicacion_id,
            estado_id,
            fecha_adquisicion,
            observaciones
        });

        res.status(201).json(nuevoEjemplar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const ejemplar = await Ejemplar.findByPk(req.params.id);

        if (!ejemplar) {
            return res.status(404).json({ error: 'Ejemplar no encontrado' });
        }

        await ejemplar.update(req.body);
        res.json({ mensaje: 'Ejemplar actualizado', ejemplar });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const ejemplar = await Ejemplar.findByPk(req.params.id);

        if (!ejemplar) {
            return res.status(404).json({ error: 'Ejemplar no encontrado' });
        }

        await ejemplar.destroy();
        res.json({ mensaje: 'Ejemplar eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
