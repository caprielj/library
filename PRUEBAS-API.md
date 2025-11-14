# Guía de Pruebas - API Biblioteca


## URL Base
```
http://localhost:3000
```

---

## 1. AUTENTICACIÓN

### Registrar usuario
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Admin Principal",
  "email": "admin@biblioteca.com",
  "password": "123456",
  "rol_id": 1,
  "telefono": "12345678"
}
```

### Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@biblioteca.com",
  "password": "123456"
}
```
**Respuesta:** Recibirás un `token` que podrás usar más adelante (cuando implementemos autenticación)

---

## 2. ROLES

### Listar todos los roles
```http
GET http://localhost:3000/api/roles
```

### Obtener un rol por ID
```http
GET http://localhost:3000/api/roles/1
```

### Crear rol
```http
POST http://localhost:3000/api/roles
Content-Type: application/json

{
  "nombre": "Supervisor",
  "descripcion": "Supervisa las operaciones"
}
```

### Actualizar rol
```http
PUT http://localhost:3000/api/roles/1
Content-Type: application/json

{
  "nombre": "Administrador",
  "descripcion": "Control total del sistema - Actualizado"
}
```

### Eliminar rol
```http
DELETE http://localhost:3000/api/roles/4
```

---

## 3. USUARIOS

### Listar todos los usuarios
```http
GET http://localhost:3000/api/usuarios
```

### Obtener usuario por ID
```http
GET http://localhost:3000/api/usuarios/1
```

### Crear usuario
```http
POST http://localhost:3000/api/usuarios
Content-Type: application/json

{
  "nombre": "Pedro López",
  "email": "pedro@email.com",
  "password": "123456",
  "rol_id": 3,
  "telefono": "55551234",
  "direccion": "Zona 1, Ciudad"
}
```

### Actualizar usuario
```http
PUT http://localhost:3000/api/usuarios/3
Content-Type: application/json

{
  "nombre": "María García Actualizada",
  "telefono": "99998888"
}
```

### Eliminar usuario
```http
DELETE http://localhost:3000/api/usuarios/5
```

---

## 4. AUTORES

### Listar autores
```http
GET http://localhost:3000/api/autores
```

### Crear autor
```http
POST http://localhost:3000/api/autores
Content-Type: application/json

{
  "nombre": "Julio",
  "apellido": "Cortázar",
  "nacionalidad": "Argentina",
  "biografia": "Escritor argentino del boom latinoamericano"
}
```

### Actualizar autor
```http
PUT http://localhost:3000/api/autores/1
Content-Type: application/json

{
  "biografia": "Premio Nobel de Literatura 1982"
}
```

---

## 5. EDITORIALES

### Listar editoriales
```http
GET http://localhost:3000/api/editoriales
```

### Crear editorial
```http
POST http://localhost:3000/api/editoriales
Content-Type: application/json

{
  "nombre": "Anagrama",
  "pais": "España",
  "descripcion": "Editorial española fundada en 1969"
}
```

---

## 6. CATEGORÍAS

### Listar categorías
```http
GET http://localhost:3000/api/categorias
```

### Crear categoría
```http
POST http://localhost:3000/api/categorias
Content-Type: application/json

{
  "nombre": "Filosofía",
  "descripcion": "Libros de pensamiento y filosofía"
}
```

---

## 7. IDIOMAS

### Listar idiomas
```http
GET http://localhost:3000/api/idiomas
```

### Crear idioma
```http
POST http://localhost:3000/api/idiomas
Content-Type: application/json

{
  "nombre": "Italiano",
  "codigo_iso": "it"
}
```

---

## 8. LIBROS

### Listar todos los libros
```http
GET http://localhost:3000/api/libros
```
**Nota:** Esta petición incluye automáticamente autor, editorial, categoría e idioma

### Buscar libros por título
```http
GET http://localhost:3000/api/libros/buscar?titulo=cien
```

### Obtener libro por ID
```http
GET http://localhost:3000/api/libros/1
```

### Crear libro
```http
POST http://localhost:3000/api/libros
Content-Type: application/json

{
  "isbn": "978-0307389732",
  "titulo": "Rayuela",
  "autor_id": 6,
  "editorial_id": 1,
  "categoria_id": 1,
  "idioma_id": 1,
  "anio_publicacion": 1963,
  "numero_paginas": 600,
  "descripcion": "Novela experimental de Julio Cortázar"
}
```

### Actualizar libro
```http
PUT http://localhost:3000/api/libros/1
Content-Type: application/json

{
  "descripcion": "Obra maestra del realismo mágico - Actualizado"
}
```

---

## 9. UBICACIONES

### Listar ubicaciones
```http
GET http://localhost:3000/api/ubicaciones
```

### Crear ubicación
```http
POST http://localhost:3000/api/ubicaciones
Content-Type: application/json

{
  "seccion": "E",
  "estante": "1",
  "nivel": "1",
  "descripcion": "Sección E - Filosofía"
}
```

---

## 10. EJEMPLARES

### Listar ejemplares
```http
GET http://localhost:3000/api/ejemplares
```
**Nota:** Incluye libro, ubicación y estado

### Crear ejemplar
```http
POST http://localhost:3000/api/ejemplares
Content-Type: application/json

{
  "codigo_ejemplar": "LIB-006-E001",
  "libro_id": 1,
  "ubicacion_id": 1,
  "estado_id": 1,
  "fecha_adquisicion": "2024-11-13",
  "condicion": "Nuevo",
  "observaciones": "Ejemplar nuevo en perfectas condiciones"
}
```

### Actualizar ejemplar
```http
PUT http://localhost:3000/api/ejemplares/1
Content-Type: application/json

{
  "estado_id": 2,
  "condicion": "Bueno"
}
```

---

## 11. PRÉSTAMOS

### Listar todos los préstamos
```http
GET http://localhost:3000/api/prestamos
```

### Listar préstamos activos
```http
GET http://localhost:3000/api/prestamos/activos
```

### Crear préstamo
```http
POST http://localhost:3000/api/prestamos
Content-Type: application/json

{
  "usuario_id": 3,
  "ejemplar_id": 1,
  "bibliotecario_id": 2,
  "fecha_prestamo": "2024-11-13",
  "fecha_devolucion_estimada": "2024-11-27",
  "observaciones": "Préstamo regular de 2 semanas"
}
```

### Actualizar préstamo (cambiar estado)
```http
PUT http://localhost:3000/api/prestamos/1
Content-Type: application/json

{
  "estado_id": 2
}
```

---

## 12. DEVOLUCIONES

### Listar devoluciones
```http
GET http://localhost:3000/api/devoluciones
```

### Registrar devolución
```http
POST http://localhost:3000/api/devoluciones
Content-Type: application/json

{
  "prestamo_id": 1,
  "bibliotecario_id": 2,
  "fecha_devolucion": "2024-11-20",
  "observaciones": "Libro devuelto en buen estado"
}
```

---

## 13. MULTAS

### Listar multas
```http
GET http://localhost:3000/api/multas
```

### Crear multa
```http
POST http://localhost:3000/api/multas
Content-Type: application/json

{
  "prestamo_id": 1,
  "usuario_id": 3,
  "monto": 50.00,
  "motivo": "Devolución tardía - 5 días de retraso",
  "fecha_multa": "2024-11-20",
  "estado_pago": 0
}
```

### Actualizar multa (marcar como pagada)
```http
PUT http://localhost:3000/api/multas/1
Content-Type: application/json

{
  "estado_pago": 1,
  "fecha_pago": "2024-11-21"
}
```

---

## Flujo de Prueba Completo

Aquí te doy un orden sugerido para probar todo el sistema:

1. **Verificar datos base**
   - GET /api/roles
   - GET /api/usuarios
   - GET /api/autores
   - GET /api/categorias
   - GET /api/idiomas

2. **Crear un libro completo**
   - POST /api/autores (crear autor)
   - POST /api/editoriales (crear editorial)
   - POST /api/libros (crear libro con los IDs anteriores)
   - POST /api/ejemplares (crear ejemplar del libro)

3. **Hacer un préstamo**
   - POST /api/prestamos (crear préstamo)
   - GET /api/prestamos/activos (ver préstamos activos)

4. **Registrar devolución**
   - POST /api/devoluciones (devolver libro)

5. **Crear multa si hubo retraso**
   - POST /api/multas (multa por retraso)

---

## Ejemplos con cURL (línea de comandos)

Si prefieres usar cURL en la terminal:

```bash
# Listar libros
curl http://localhost:3000/api/libros

# Crear autor
curl -X POST http://localhost:3000/api/autores \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Julio","apellido":"Cortázar","nacionalidad":"Argentina"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@biblioteca.com","password":"123456"}'
```

---

## Tips para las pruebas

1. **Orden de IDs:** Cuando crees registros, los IDs se auto-incrementan. Usa los IDs correctos en las relaciones.

2. **Fechas:** Usa formato `YYYY-MM-DD` para las fechas.

3. **Validaciones:** Si recibes errores, lee el mensaje. Los modelos tienen validaciones que te dirán qué falta.

4. **Relaciones:** Asegúrate de que existan los registros relacionados antes de crear. Por ejemplo, antes de crear un libro, debe existir el autor, editorial, categoría e idioma.

5. **JSON válido:** Verifica que tu JSON esté bien formado (comillas dobles, sin comas extras al final).
