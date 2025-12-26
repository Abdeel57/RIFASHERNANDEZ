# Instrucciones de Configuración Inicial

## 🎯 Pasos para Configurar tu Plataforma de Rifas

### 1. Configuración de Base de Datos
1. Crea una base de datos PostgreSQL (puedes usar Railway, Supabase, o cualquier proveedor)
2. Copia `backend/.env.example` a `backend/.env`
3. Actualiza `DATABASE_URL` con tus credenciales de base de datos
4. Genera un `JWT_SECRET` único y seguro

### 2. Inicializar Base de Datos
Ejecuta en la terminal:
```bash
cd backend
npm run migrate:deploy
```

### 3. Configurar Dominio en Backend
Edita `backend/src/main.ts` y agrega tu dominio a la lista de CORS:
```typescript
const allowedOrigins = [
  // ... otros dominios ...
  'https://tudominio.com',
  'https://www.tudominio.com',
];
```

### 4. Iniciar la Aplicación
```bash
npm start
```

### 5. Acceder al Panel de Administración
1. Ve a: http://localhost:5173/#/admin
2. Inicia sesión (si no hay usuario, el sistema te guiará para crear uno)
3. Ve a **Configuración** y completa:
   - Nombre del sitio
   - Logo y favicon
   - Colores de la marca
   - Información de contacto
   - Redes sociales
   - Cuentas de pago
   - Preguntas frecuentes

### 6. Personalizar Meta Tags
Edita `frontend/index.html` y actualiza:
- Título de la página
- URLs de Open Graph y Twitter
- Descripciones

### 7. Crear tu Primera Rifa
1. Ve al panel de administración
2. Haz clic en **Nueva Rifa**
3. Completa la información
4. Publica la rifa

## ✅ Listo!
Tu plataforma está lista para recibir clientes.

## 📞 Soporte
Si necesitas ayuda, contacta al desarrollador.
