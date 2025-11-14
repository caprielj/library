// Rutas de Ubicaciones
const express = require('express');
const router = express.Router();
const ubicacionesController = require('../controllers/ubicaciones.controller');

// GET /api/ubicaciones - Obtener todas las ubicaciones
router.get('/', ubicacionesController.getAll);

// GET /api/ubicaciones/:id - Obtener una ubicación por ID
router.get('/:id', ubicacionesController.getById);

// POST /api/ubicaciones - Crear nueva ubicación
router.post('/', ubicacionesController.create);

// PUT /api/ubicaciones/:id - Actualizar ubicación
router.put('/:id', ubicacionesController.update);

// DELETE /api/ubicaciones/:id - Eliminar ubicación
router.delete('/:id', ubicacionesController.delete);

module.exports = router;
