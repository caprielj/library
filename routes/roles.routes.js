// Rutas de Roles
const express = require('express');
const router = express.Router();
const rolesController = require('../controllers/roles.controller');

// GET /api/roles - Obtener todos los roles
router.get('/', rolesController.getAll);

// GET /api/roles/:id - Obtener un rol por ID
router.get('/:id', rolesController.getById);

// POST /api/roles - Crear nuevo rol
router.post('/', rolesController.create);

// PUT /api/roles/:id - Actualizar rol
router.put('/:id', rolesController.update);

// DELETE /api/roles/:id - Eliminar rol
router.delete('/:id', rolesController.delete);

module.exports = router;
