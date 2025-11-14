
// MODELO: CATEGORIAS
// Archivo: models/categoria.model.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/db');

const Categoria = sequelize.define('Categoria', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'ID único de la categoría'
    },
    
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Nombre de la categoría (Ficción, Ciencia, etc)',
        validate: {
            notEmpty: { msg: 'El nombre no puede estar vacío' },
            len: { args: [3, 100], msg: 'Entre 3 y 100 caracteres' }
        }
    },
    
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción de la categoría'
    },
    
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '1=Activo, 0=Inactivo'
    },
    
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Categorias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Categoria;