// Controlador de Idiomas
const Idioma = require('../models/idioma.model');

// Obtener todos
exports.getAll = async (req, res) => {
    try {
        const idiomas = await Idioma.findAll({
            order: [['nombre', 'ASC']]
        });
        res.json(idiomas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener por ID
exports.getById = async (req, res) => {
    try {
        const idioma = await Idioma.findByPk(req.params.id);

        if (!idioma) {
            return res.status(404).json({ error: 'Idioma no encontrado' });
        }

        res.json(idioma);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear
exports.create = async (req, res) => {
    try {
        const { nombre, codigo } = req.body;

        const nuevoIdioma = await Idioma.create({
            nombre,
            codigo
        });

        res.status(201).json(nuevoIdioma);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
exports.update = async (req, res) => {
    try {
        const idioma = await Idioma.findByPk(req.params.id);

        if (!idioma) {
            return res.status(404).json({ error: 'Idioma no encontrado' });
        }

        await idioma.update(req.body);
        res.json({ mensaje: 'Idioma actualizado', idioma });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar
exports.delete = async (req, res) => {
    try {
        const idioma = await Idioma.findByPk(req.params.id);

        if (!idioma) {
            return res.status(404).json({ error: 'Idioma no encontrado' });
        }

        await idioma.destroy();
        res.json({ mensaje: 'Idioma eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
