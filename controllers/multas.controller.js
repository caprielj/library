// Controlador de Multas
const Multa = require('../models/multa.model');
const Prestamo = require('../models/prestamo.model');
const Usuario = require('../models/usuario.model');

// Obtener todas
exports.getAll = async (req, res) => {
    try {
        const multas = await Multa.findAll({
            include: [
                { model: Prestamo, as: 'prestamo' },
                { model: Usuario, as: 'usuario' }
            ],
            order: [['fecha_multa', 'DESC']]
        });
        res.json(multas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const multa = await Multa.findByPk(req.params.id, {
            include: [
                { model: Prestamo, as: 'prestamo' },
                { model: Usuario, as: 'usuario' }
            ]
        });

        if (!multa) {
            return res.status(404).json({ error: 'Multa no encontrada' });
        }

        res.json(multa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { prestamo_id, usuario_id, monto, motivo, fecha_multa, estado_pago } = req.body;

        const nuevaMulta = await Multa.create({
            prestamo_id,
            usuario_id,
            monto,
            motivo,
            fecha_multa,
            estado_pago
        });

        res.status(201).json(nuevaMulta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const multa = await Multa.findByPk(req.params.id);

        if (!multa) {
            return res.status(404).json({ error: 'Multa no encontrada' });
        }

        await multa.update(req.body);
        res.json({ mensaje: 'Multa actualizada', multa });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const multa = await Multa.findByPk(req.params.id);

        if (!multa) {
            return res.status(404).json({ error: 'Multa no encontrada' });
        }

        await multa.destroy();
        res.json({ mensaje: 'Multa eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
