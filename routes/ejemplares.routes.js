// Rutas de Ejemplares
const express = require('express');
const router = express.Router();
const ejemplaresController = require('../controllers/ejemplares.controller');

// GET /api/ejemplares - Obtener todos los ejemplares
router.get('/', ejemplaresController.getAll);

// GET /api/ejemplares/:id - Obtener un ejemplar por ID
router.get('/:id', ejemplaresController.getById);

// POST /api/ejemplares - Crear nuevo ejemplar
router.post('/', ejemplaresController.create);

// PUT /api/ejemplares/:id - Actualizar ejemplar
router.put('/:id', ejemplaresController.update);

// DELETE /api/ejemplares/:id - Eliminar ejemplar
router.delete('/:id', ejemplaresController.delete);

module.exports = router;
