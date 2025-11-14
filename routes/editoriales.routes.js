// Rutas de Editoriales
const express = require('express');
const router = express.Router();
const editorialesController = require('../controllers/editoriales.controller');

// GET /api/editoriales - Obtener todas las editoriales
router.get('/', editorialesController.getAll);

// GET /api/editoriales/:id - Obtener una editorial por ID
router.get('/:id', editorialesController.getById);

// POST /api/editoriales - Crear nueva editorial
router.post('/', editorialesController.create);

// PUT /api/editoriales/:id - Actualizar editorial
router.put('/:id', editorialesController.update);

// DELETE /api/editoriales/:id - Eliminar editorial
router.delete('/:id', editorialesController.delete);

module.exports = router;
