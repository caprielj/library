// Rutas de Préstamos
const express = require('express');
const router = express.Router();
const prestamosController = require('../controllers/prestamos.controller');

// GET /api/prestamos - Obtener todos los préstamos
router.get('/', prestamosController.getAll);

// GET /api/prestamos/activos - Obtener préstamos activos
router.get('/activos', prestamosController.getActivos);

// GET /api/prestamos/:id - Obtener un préstamo por ID
router.get('/:id', prestamosController.getById);

// POST /api/prestamos - Crear nuevo préstamo
router.post('/', prestamosController.create);

// PUT /api/prestamos/:id - Actualizar préstamo
router.put('/:id', prestamosController.update);

// DELETE /api/prestamos/:id - Eliminar préstamo
router.delete('/:id', prestamosController.delete);

module.exports = router;
