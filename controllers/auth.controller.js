// Controlador de Autenticación
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');

// Registrar nuevo usuario
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol_id, telefono, direccion } = req.body;

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: passwordHash,
            rol_id: rol_id || 3, // Por defecto rol Usuario (3)
            telefono,
            direccion
        });

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({
            where: { email },
            include: [{ model: Rol, as: 'rol' }]
        });

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar que el usuario esté activo
        if (usuario.estado === 0) {
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol.nombre },
            process.env.JWT_SECRET || 'secret_key_default',
            { expiresIn: '24h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol.nombre
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
