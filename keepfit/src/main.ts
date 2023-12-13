import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { print } from 'listening-on';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { sessionMiddleware } from './session';
import * as express from 'express';

async function bootstrap() {
  const expressApp = express();
  // expressApp.use(express.static('public'));
  expressApp.use('/photoUploads', express.static('photoUploads'));
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useStaticAssets('public');
  app.use(sessionMiddleware);
  let port = 8080;
  await app.listen(port);
  print(port);
}

bootstrap();
