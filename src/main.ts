import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { AppModule } from './app.module';
import { WebsocketAdapter } from './chat/gateway/gateway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adapter = new WebsocketAdapter(app);

  app.useWebSocketAdapter(adapter)
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3333);
}
bootstrap();
