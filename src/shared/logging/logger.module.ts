import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
const config = {
    level: 'debug',
    loggers: [ 'console' ],
    timeFormat: 'YYYY-MM-DD HH:mm:ss',
}

@Module({
    providers: [
        {
            provide: LoggerService,
            useFactory: () => new LoggerService(config),
            inject: [],
        }
    ],
    exports: [
        LoggerService,
    ]
})
export class LoggerModule { }
