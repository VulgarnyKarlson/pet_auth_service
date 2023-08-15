import dotenv from 'dotenv'
import * as process from 'process';

dotenv.config({ path: '.env' })

export class AppConfig {

    public static readonly IS_PRODUCTION = process.env.NODE_ENV === 'production'
    public static PORT = Number(process.env.PORT) || 3000

    public static JWT = {
        authSecret: process.env.JWT_AUTH_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    }

    public static readonly DATABASE_URL = process.env.DATABASE_URL
}
