// Este archivo configura la conexión a la base de datos
// usando Sequelize ORM (Object-Relational Mapping)

// Importar Sequelize - ORM para trabajar con bases de datos SQL
const { Sequelize } = require('sequelize');

// Importar dotenv para leer variables de entorno desde el archivo .env
require('dotenv').config();

/**
 * Instancia de Sequelize - Conexión a la base de datos
 * 
 * Parámetros del constructor Sequelize:
 * 1. Nombre de la base de datos
 * 2. Usuario de la base de datos
 * 3. Contraseña del usuario
 * 4. Objeto de configuración con opciones adicionales
 */
const sequelize = new Sequelize(
    process.env.DB_NAME || 'biblioteca_db',     // Nombre de la BD desde .env
    process.env.DB_USER || 'root',              // Usuario desde .env
    process.env.DB_PASSWORD || '',              // Contraseña desde .env
    {
        // Host donde está la base de datos (localhost en desarrollo)
        host: process.env.DB_HOST || 'localhost',
        
        // Puerto de la base de datos (3306 es el puerto por defecto de MySQL/MariaDB)
        port: process.env.DB_PORT || 3306,
        
        // Dialecto de la base de datos ('mysql', 'mariadb', 'postgres', 'sqlite')
        dialect: process.env.DB_DIALECT || 'mysql',
        
        // Desactivar logging de SQL en consola
        // En desarrollo puedes dejarlo en true para ver las queries SQL
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        
        // Pool de conexiones - Gestiona múltiples conexiones simultáneas
        pool: {
            max: 5,          // Máximo de conexiones en el pool
            min: 0,          // Mínimo de conexiones en el pool
            acquire: 30000,  // Tiempo máximo (ms) para obtener una conexión
            idle: 10000      // Tiempo máximo (ms) que una conexión puede estar inactiva
        },
        
        // Define el timezone de las fechas
        timezone: '-06:00',  // Guatemala está en GMT-6
        
        // Configuración adicional de Sequelize
        define: {
            // Usar timestamps automáticos (createdAt, updatedAt)
            timestamps: false,
            
            // Evitar que Sequelize pluralice nombres de tablas
            freezeTableName: true,
            
            // No usar snake_case automático
            underscored: false
        }
    }
);

/**
 * Función para probar la conexión a la base de datos
 * Esta función se llamará al iniciar el servidor
 */
const testConnection = async () => {
    try {
        // authenticate() intenta conectarse a la BD
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa');
        console.log(`Base de datos: ${process.env.DB_NAME || 'biblioteca_db'}`);
        console.log(`Host: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
    } catch (error) {
        // Si hay error, mostrarlo en consola
        console.error('Error al conectar a la base de datos:', error.message);
        console.error('Verifica tus credenciales en el archivo .env');
        
        // Terminar el proceso si no hay conexión
        process.exit(1);
    }
};

// Exportar la instancia de Sequelize y la función de prueba
module.exports = {
    sequelize,
    testConnection
};