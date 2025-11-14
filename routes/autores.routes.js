// Rutas de Autores
const express = require('express');
const router = express.Router();
const autoresController = require('../controllers/autores.controller');

// GET /api/autores - Obtener todos los autores
router.get('/', autoresController.getAll);

// GET /api/autores/:id - Obtener un autor por ID
router.get('/:id', autoresController.getById);

// POST /api/autores - Crear nuevo autor
router.post('/', autoresController.create);

// PUT /api/autores/:id - Actualizar autor
router.put('/:id', autoresController.update);

// DELETE /api/autores/:id - Eliminar autor
router.delete('/:id', autoresController.delete);

module.exports = router;
