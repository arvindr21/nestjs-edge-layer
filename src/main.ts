import * as compression from 'compression';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: false
  });

  // security
  app.use(helmet());

  // cross site request forgery - all requests that pass through `dps-edge` will need to send the CSRF token back 
  // app.use(csurf());

  // Rate limit to prevent DDOS attacks
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  // response compression - save bandwidth
  app.use(compression());

  const options = new DocumentBuilder()
    .setTitle('DPS Edge API')
    .setDescription('DPS reverse proxy Edge APII')
    .setVersion('1.0')
    .addTag('dps-edge')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1', app, document);

  await app.listen(3000);
}
bootstrap();
