// Controlador de Roles
const Rol = require('../models/rol.model');

// Obtener todos los roles
exports.getAll = async (req, res) => {
    try {
        const roles = await Rol.findAll({
            order: [['id', 'ASC']]
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un rol por ID
exports.getById = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);

        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        res.json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear rol
exports.create = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        const nuevoRol = await Rol.create({
            nombre,
            descripcion
        });

        res.status(201).json(nuevoRol);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar rol
exports.update = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);

        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        const { nombre, descripcion, estado } = req.body;

        await rol.update({
            nombre,
            descripcion,
            estado
        });

        res.json({ mensaje: 'Rol actualizado', rol });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar rol
exports.delete = async (req, res) => {
    try {
        const rol = await Rol.findByPk(req.params.id);

        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        await rol.destroy();
        res.json({ mensaje: 'Rol eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
