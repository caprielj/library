// Controlador de Devoluciones
const Devolucion = require('../models/devolucion.model');
const Prestamo = require('../models/prestamo.model');
const Usuario = require('../models/usuario.model');

// Obtener todas
exports.getAll = async (req, res) => {
    try {
        const devoluciones = await Devolucion.findAll({
            include: [
                { model: Prestamo, as: 'prestamo' },
                { model: Usuario, as: 'bibliotecario' }
            ],
            order: [['fecha_devolucion', 'DESC']]
        });
        res.json(devoluciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const devolucion = await Devolucion.findByPk(req.params.id, {
            include: [
                { model: Prestamo, as: 'prestamo' },
                { model: Usuario, as: 'bibliotecario' }
            ]
        });

        if (!devolucion) {
            return res.status(404).json({ error: 'Devolución no encontrada' });
        }

        res.json(devolucion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear (registrar devolución)
exports.create = async (req, res) => {
    try {
        const { prestamo_id, bibliotecario_id, fecha_devolucion, observaciones } = req.body;

        const nuevaDevolucion = await Devolucion.create({
            prestamo_id,
            bibliotecario_id,
            fecha_devolucion,
            observaciones
        });

        res.status(201).json(nuevaDevolucion);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const devolucion = await Devolucion.findByPk(req.params.id);

        if (!devolucion) {
            return res.status(404).json({ error: 'Devolución no encontrada' });
        }

        await devolucion.update(req.body);
        res.json({ mensaje: 'Devolución actualizada', devolucion });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const devolucion = await Devolucion.findByPk(req.params.id);

        if (!devolucion) {
            return res.status(404).json({ error: 'Devolución no encontrada' });
        }

        await devolucion.destroy();
        res.json({ mensaje: 'Devolución eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
