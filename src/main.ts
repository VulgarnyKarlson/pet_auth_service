import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppConfig } from 'config/app.config';
import { LoggerService } from 'shared/logging/logger.service';
import { AppModule } from './app.module';

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule)
    app.connectMicroservice({
        transport: Transport.GRPC,
        options: {
            package: 'auth',
            protoPath: __dirname + '/../proto/auth.proto',
            port: AppConfig.GRPC_PORT,
        },
    })
    const loggerService = app.get(LoggerService)
    app.useLogger(loggerService)

    process.on('uncaughtException', err => {
        if (typeof err.message !== 'undefined') {
            loggerService.error(err.message + '\n' + err.stack, 'uncaughtException')
        }
    })
    app.setGlobalPrefix('api/v1/auth');
    app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }))
    await app.startAllMicroservices()
    await app.listen(AppConfig.HTTP_PORT)
}

void bootstrap()
