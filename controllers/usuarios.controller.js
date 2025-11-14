// Controlador de Usuarios
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [{ model: Rol, as: 'rol' }],
            order: [['id', 'ASC']]
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
exports.getById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{ model: Rol, as: 'rol' }]
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear usuario
exports.create = async (req, res) => {
    try {
        const { nombre, email, password, rol_id, telefono, direccion, numero_carnet } = req.body;

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol_id,
            telefono,
            direccion,
            numero_carnet
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar usuario
exports.update = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { nombre, email, telefono, direccion, rol_id, estado, numero_carnet } = req.body;

        await usuario.update({
            nombre,
            email,
            telefono,
            direccion,
            rol_id,
            estado,
            numero_carnet
        });

        res.json({ mensaje: 'Usuario actualizado', usuario });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar usuario
exports.delete = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await usuario.destroy();
        res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
