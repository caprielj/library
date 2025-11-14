// Rutas de Devoluciones
const express = require('express');
const router = express.Router();
const devolucionesController = require('../controllers/devoluciones.controller');

// GET /api/devoluciones - Obtener todas las devoluciones
router.get('/', devolucionesController.getAll);

// GET /api/devoluciones/:id - Obtener una devolución por ID
router.get('/:id', devolucionesController.getById);

// POST /api/devoluciones - Registrar devolución
router.post('/', devolucionesController.create);

// PUT /api/devoluciones/:id - Actualizar devolución
router.put('/:id', devolucionesController.update);

// DELETE /api/devoluciones/:id - Eliminar devolución
router.delete('/:id', devolucionesController.delete);

module.exports = router;
