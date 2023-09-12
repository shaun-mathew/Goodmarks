import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';
import session from 'express-session';
import passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  const whitelist = [
    `/^chrome-extension:\/\//`,
    'http://localhost:1234',
    'chrome-extension://hgomieojikenomanpadngnidgmkpiihb',
  ];
  app.use(json({ limit: '50mb' }));
  app.enableCors({
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('COOKIE_SECRET'),
      saveUninitialized: false,
      resave: true,
      rolling: true,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();
