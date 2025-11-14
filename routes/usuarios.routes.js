// Rutas de Usuarios
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', usuariosController.getAll);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', usuariosController.getById);

// POST /api/usuarios - Crear nuevo usuario
router.post('/', usuariosController.create);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', usuariosController.update);

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', usuariosController.delete);

module.exports = router;
