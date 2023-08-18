import dotenv from 'dotenv'
import * as process from 'process';

dotenv.config({ path: '.default.env' })

export class AppConfig {

    public static readonly IS_PRODUCTION = process.env.NODE_ENV === 'production'
    public static HTTP_PORT = Number(process.env.HTTP_PORT) || 3000
    public static GRPC_PORT = Number(process.env.GRPC_PORT) || 5000

    public static JWT = {
        authSecret: process.env.JWT_AUTH_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }

    public static readonly DATABASE_URL = `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}?schema=public`
}
