import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebsocketAdapter } from './gateway/gateway.adapter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const config: ConfigService = new ConfigService();
  const PORT = 3333;
  const httpsOptions = {
    key: fs.readFileSync(config.get('SSL_PRIVATE_KEY')),
    cert: fs.readFileSync(config.get('SSL_CA_CERT')),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  const adapter = new WebsocketAdapter(app);
  const configDocument = new DocumentBuilder()
    .setTitle('chatapp api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup('api', app, document);

  app.useWebSocketAdapter(adapter);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  try {
    await app.listen(PORT, () => {
      console.log(`Running on Port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
