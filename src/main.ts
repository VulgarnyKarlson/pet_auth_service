import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from 'config/app.config';
import { LoggerService } from 'shared/logging/logger.service';
import { AppModule } from './app.module';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    const loggerService = app.get(LoggerService)
    app.useLogger(loggerService)

    process.on('uncaughtException', err => {
        if (typeof err.message !== 'undefined') {
            loggerService.error(err.message + '\n' + err.stack, 'uncaughtException')
        }
    })
    app.setGlobalPrefix('api/v1/auth');
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Auth Service')
        .setVersion('0.1')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/swagger', app, document);
    await app.listen(AppConfig.PORT)
}

void bootstrap()
