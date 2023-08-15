import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as process from 'process';

dotenv.config({ path: '.env' })

export class AppConfig {
    public static PORT = Number(process.env.PORT) || 3000

    public static JWT = {
        secret: process.env.JWT_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }

    private static readonly DATABASE = {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }

    public static createDatabaseOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: AppConfig.DATABASE.host,
            port: AppConfig.DATABASE.port,
            username: AppConfig.DATABASE.username,
            password: AppConfig.DATABASE.password,
            database: AppConfig.DATABASE.database,
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy(),
            autoLoadEntities: true,
            keepConnectionAlive: true,
        }
    }
}
