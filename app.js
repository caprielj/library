// =====================================================
// SERVIDOR PRINCIPAL - PROYECTO BIBLIOTECA API
// Archivo: app.js
// =====================================================
// Este es el punto de entrada de la aplicación
// Configura Express y todos los middlewares necesarios

// IMPORTAR DEPENDENCIAS
const express = require('express');           // Framework web para Node.js
const cors = require('cors');                 // Habilitar CORS para peticiones desde otros dominios
require('dotenv').config();                   // Cargar variables de entorno desde .env

// Importar configuración de base de datos
const { sequelize, testConnection } = require('./db/db');

// IMPORTAR RUTAS
// Aquí importaremos todas las rutas de nuestra API
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const rolesRoutes = require('./routes/roles.routes');
const autoresRoutes = require('./routes/autores.routes');
const editorialesRoutes = require('./routes/editoriales.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const idiomasRoutes = require('./routes/idiomas.routes');
const librosRoutes = require('./routes/libros.routes');
const ubicacionesRoutes = require('./routes/ubicaciones.routes');
const ejemplaresRoutes = require('./routes/ejemplares.routes');
const prestamosRoutes = require('./routes/prestamos.routes');
const devolucionesRoutes = require('./routes/devoluciones.routes');
const multasRoutes = require('./routes/multas.routes');

// CREAR INSTANCIA DE EXPRESS
const app = express();

// CONFIGURAR MIDDLEWARES GLOBALES

// 1. CORS - Permitir peticiones desde cualquier origen
// En producción, deberías especificar solo los dominios permitidos
app.use(cors());

// 2. Body Parser - Para leer el cuerpo de las peticiones
// express.json() permite leer JSON en el body de las peticiones POST/PUT
app.use(express.json());

// express.urlencoded() permite leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// 3. Middleware de logging - Registrar todas las peticiones
// Este middleware se ejecuta en TODAS las peticiones
app.use((req, res, next) => {
    // Mostrar en consola: método HTTP, URL y timestamp
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next(); // Pasar al siguiente middleware
});

// RUTA RAÍZ 
// Ruta de bienvenida que muestra información del API
app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Sistema de Biblioteca',
        version: '1.0.0',
        autor: 'Capriel',
        endpoints: {
            autenticacion: '/api/auth',
            usuarios: '/api/usuarios',
            roles: '/api/roles',
            autores: '/api/autores',
            editoriales: '/api/editoriales',
            categorias: '/api/categorias',
            idiomas: '/api/idiomas',
            libros: '/api/libros',
            ubicaciones: '/api/ubicaciones',
            ejemplares: '/api/ejemplares',
            prestamos: '/api/prestamos',
            devoluciones: '/api/devoluciones',
            multas: '/api/multas'
        },
        documentacion: 'Ver README.md para documentación completa'
    });
});

// REGISTRAR RUTAS DE LA API 
// Todas las rutas tendrán el prefijo '/api'

// Rutas de autenticación (login, register)
app.use('/api/auth', authRoutes);

// Rutas de gestión de usuarios
app.use('/api/usuarios', usuariosRoutes);

// Rutas de roles y permisos
app.use('/api/roles', rolesRoutes);

// Rutas del catálogo de libros
app.use('/api/autores', autoresRoutes);
app.use('/api/editoriales', editorialesRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/idiomas', idiomasRoutes);
app.use('/api/libros', librosRoutes);

// Rutas de inventario
app.use('/api/ubicaciones', ubicacionesRoutes);
app.use('/api/ejemplares', ejemplaresRoutes);

// Rutas de préstamos y devoluciones
app.use('/api/prestamos', prestamosRoutes);
app.use('/api/devoluciones', devolucionesRoutes);
app.use('/api/multas', multasRoutes);

// MIDDLEWARE PARA RUTAS NO ENCONTRADAS 
// Este middleware se ejecuta si ninguna ruta coincide
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        mensaje: `La ruta ${req.method} ${req.url} no existe en este servidor`,
        sugerencia: 'Verifica la documentación del API'
    });
});

// MIDDLEWARE DE MANEJO DE ERRORES GLOBAL 
// Este middleware captura todos los errores que ocurran en la aplicación
app.use((err, req, res, next) => {
    // Log del error en consola para debugging
    console.error(' Error:', err);
    
    // Responder con el error
    res.status(err.status || 500).json({
        error: err.message || '  Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
    try {
        // 1. Probar conexión a la base de datos
        await testConnection();
        
        // 2. Sincronizar modelos con la base de datos
        // alter: true actualiza las tablas si hay cambios en los modelos
        // force: true BORRA y recrea las tablas (¡cuidado en producción!)
        await sequelize.sync({ alter: false });
        console.log('Modelos sincronizados con la base de datos');
        
        // 3. Iniciar el servidor Express
        app.listen(PORT, () => {
            console.log('');
            console.log('===========================================');
            console.log(` Servidor corriendo en puerto ${PORT}`);
            console.log(` URL: http://localhost:${PORT}`);
            console.log(` Ambiente: ${process.env.NODE_ENV}`);
            console.log('===========================================');
            console.log('');
            console.log('Presiona CTRL+C para detener el servidor');
            console.log('');
        });
        
    } catch (error) {
        // Si hay error al iniciar, mostrar y terminar proceso
        console.error(' Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

// Llamar a la función para iniciar el servidor
startServer();

// Exportar la instancia de Express (útil para testing)
module.exports = app;