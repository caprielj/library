// Rutas de Libros
const express = require('express');
const router = express.Router();
const librosController = require('../controllers/libros.controller');

// GET /api/libros - Obtener todos los libros
router.get('/', librosController.getAll);

// GET /api/libros/buscar?titulo=... - Buscar libros por título
router.get('/buscar', librosController.buscar);

// GET /api/libros/:id - Obtener un libro por ID
router.get('/:id', librosController.getById);

// POST /api/libros - Crear nuevo libro
router.post('/', librosController.create);

// PUT /api/libros/:id - Actualizar libro
router.put('/:id', librosController.update);

// DELETE /api/libros/:id - Eliminar libro
router.delete('/:id', librosController.delete);

module.exports = router;
