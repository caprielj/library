// Rutas de Multas
const express = require('express');
const router = express.Router();
const multasController = require('../controllers/multas.controller');

// GET /api/multas - Obtener todas las multas
router.get('/', multasController.getAll);

// GET /api/multas/:id - Obtener una multa por ID
router.get('/:id', multasController.getById);

// POST /api/multas - Crear nueva multa
router.post('/', multasController.create);

// PUT /api/multas/:id - Actualizar multa
router.put('/:id', multasController.update);

// DELETE /api/multas/:id - Eliminar multa
router.delete('/:id', multasController.delete);

module.exports = router;
