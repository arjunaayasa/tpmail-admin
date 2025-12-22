import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for admin panel
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://admin.gencutaraka.xyz',
      'https://gencutaraka.xyz',
    ],
    credentials: true,
  });

  // Disable caching for API responses
  app.use((req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

