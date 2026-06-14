import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // CORS configuration
  app.enableCors();
  
  // Global API route prefix
  app.setGlobalPrefix('api');
  
  // Validation piping
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  
  // Static media asset serving
  app.useStaticAssets(path.join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend server successfully listening on port ${port}`);
}
bootstrap();
