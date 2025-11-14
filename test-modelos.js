// test-modelos.js
require('dotenv').config();
const { sequelize } = require('./db/db');

// Importar todos los modelos
const Rol = require('./models/rol.model');
const Usuario = require('./models/usuario.model');
const Autor = require('./models/autor.model');
const Libro = require('./models/libro.model');
// ... importa los demás si quieres

async function probarConexion() {
    try {
        // Probar conexión
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa');
        
        // Probar consulta
        const roles = await Rol.findAll();
        console.log('✅ Roles encontrados:', roles.length);
        
        roles.forEach(rol => {
            console.log(`  - ${rol.nombre}`);
        });
        
        console.log('\n¡Todo funciona correctamente! 🎉');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

probarConexion();