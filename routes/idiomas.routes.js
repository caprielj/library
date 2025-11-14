// Rutas de Idiomas
const express = require('express');
const router = express.Router();
const idiomasController = require('../controllers/idiomas.controller');

// GET /api/idiomas - Obtener todos los idiomas
router.get('/', idiomasController.getAll);

// GET /api/idiomas/:id - Obtener un idioma por ID
router.get('/:id', idiomasController.getById);

// POST /api/idiomas - Crear nuevo idioma
router.post('/', idiomasController.create);

// PUT /api/idiomas/:id - Actualizar idioma
router.put('/:id', idiomasController.update);

// DELETE /api/idiomas/:id - Eliminar idioma
router.delete('/:id', idiomasController.delete);

module.exports = router;
