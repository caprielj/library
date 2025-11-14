// Controlador de Préstamos
const Prestamo = require('../models/prestamo.model');
const Usuario = require('../models/usuario.model');
const Ejemplar = require('../models/ejemplar.model');
const EstadoPrestamo = require('../models/estadoPrestamo.model');

// Obtener todos
exports.getAll = async (req, res) => {
    try {
        const prestamos = await Prestamo.findAll({
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Ejemplar, as: 'ejemplar' },
                { model: Usuario, as: 'bibliotecario' },
                { model: EstadoPrestamo, as: 'estado' }
            ],
            order: [['fecha_prestamo', 'DESC']]
        });
        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener activos
exports.getActivos = async (req, res) => {
    try {
        const estadoActivo = await EstadoPrestamo.findOne({
            where: { nombre: 'Activo' }
        });

        if (!estadoActivo) {
            return res.json([]);
        }

        const prestamos = await Prestamo.findAll({
            where: { estado_id: estadoActivo.id },
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Ejemplar, as: 'ejemplar' },
                { model: Usuario, as: 'bibliotecario' },
                { model: EstadoPrestamo, as: 'estado' }
            ],
            order: [['fecha_prestamo', 'DESC']]
        });

        res.json(prestamos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const prestamo = await Prestamo.findByPk(req.params.id, {
            include: [
                { model: Usuario, as: 'usuario' },
                { model: Ejemplar, as: 'ejemplar' },
                { model: Usuario, as: 'bibliotecario' },
                { model: EstadoPrestamo, as: 'estado' }
            ]
        });

        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        res.json(prestamo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { usuario_id, ejemplar_id, bibliotecario_id, fecha_prestamo, fecha_devolucion_estimada, observaciones } = req.body;

        // Obtener estado "Activo" por defecto
        const estadoActivo = await EstadoPrestamo.findOne({
            where: { nombre: 'Activo' }
        });

        const nuevoPrestamo = await Prestamo.create({
            usuario_id,
            ejemplar_id,
            bibliotecario_id,
            estado_id: estadoActivo ? estadoActivo.id : 1,
            fecha_prestamo,
            fecha_devolucion_estimada,
            observaciones
        });

        res.status(201).json(nuevoPrestamo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const prestamo = await Prestamo.findByPk(req.params.id);

        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        await prestamo.update(req.body);
        res.json({ mensaje: 'Préstamo actualizado', prestamo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const prestamo = await Prestamo.findByPk(req.params.id);

        if (!prestamo) {
            return res.status(404).json({ error: 'Préstamo no encontrado' });
        }

        await prestamo.destroy();
        res.json({ mensaje: 'Préstamo eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
