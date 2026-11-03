import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('NestDecor API')
    .setDescription('CO3043 | Two REST collections: Products and Designs. Demo uses in-memory data, reset on restart.')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { swaggerOptions: { persistAuthorization: true } });
  await app.listen(Number(process.env.PORT) || 3000, '0.0.0.0');
}
void bootstrap();
