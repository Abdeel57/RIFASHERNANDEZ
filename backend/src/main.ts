
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Disable default body parser
  });

  // Enable Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      // Formatear errores de validación de forma amigable
      const messages = errors.map(error => {
        const constraints = error.constraints || {};
        return Object.values(constraints)[0] || 'Error de validación';
      });
      return new HttpException(
        {
          message: messages,
          error: 'Bad Request',
          statusCode: 400,
        },
        400
      );
    },
  }));

  // Configure body parser with increased limit for images
  const express = require('express');
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS with specific configuration
  // ⚠️ IMPORTANTE: Para agregar un nuevo cliente, agrega sus dominios aquí
  // Formato: 'https://dominio.com' y 'https://www.dominio.com'
  const allowedOrigins = [
    /^http:\/\/localhost:5173$/, // Vite dev server (desarrollo local)
    /\.onrender\.com$/, // Any Render subdomain
    /\.netlify\.app$/, // Any Netlify subdomain
    /dashboard\.render\.com$/, // Render dashboard
    
    // ============================================
    // DOMINIOS DE CLIENTES - Agrega aquí los nuevos
    // ============================================
    // Ejemplo de cómo agregar un nuevo cliente:
    // 'https://cliente-nuevo.com',
    // 'https://www.cliente-nuevo.com',
    // 'http://cliente-nuevo.com', // Solo si necesitas HTTP en desarrollo
    // 'http://www.cliente-nuevo.com',
    
    // Cliente: Sorteos Gama
    'https://sorteosgama.pro',
    'https://www.sorteosgama.pro',
    'http://sorteosgama.pro',
    'http://www.sorteosgama.pro',
    
    // Cliente: Lucky Snap (legacy)
    'https://luckysnaphn.com',
    'https://www.luckysnaphn.com',
    'https://luckysnap.netlify.app',
    'https://neodemo.netlify.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true); // Allow non-browser requests
      }

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        return callback(null, origin);
      }

      console.warn(`CORS bloqueado para origen no permitido: ${origin}`);
      return callback(new Error(`CORS origin not allowed: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Add a simple root route before setting the global prefix
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'Lucky Snap Backend API',
      status: 'running',
      version: '1.0.0',
      endpoints: {
        api: '/api',
        health: '/api/health'
      }
    });
  });

  // Add health check endpoint
  app.getHttpAdapter().get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  app.setGlobalPrefix('api'); // Set a global prefix for all routes

  const port = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  console.log(`🚀 Lucky Snap Backend starting...`);
  console.log(`📡 Environment: ${nodeEnv}`);
  console.log(`🌐 Port: ${port}`);
  console.log(`🔗 API Base: http://localhost:${port}/api`);

  await app.listen(port);
}
bootstrap();
