import { PrismaClient } from '.prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AppConfig } from 'config/app.config';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const url = 'postgres://' +
            `${AppConfig.DATABASE.username}:${AppConfig.DATABASE.password}@` +
            `${AppConfig.DATABASE.host}:${AppConfig.DATABASE.port}/${AppConfig.DATABASE.database}?schema=public`;

        super({
            datasources: {
                db: {
                    url,
                },
            },
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async cleanDatabase() {
        if (AppConfig.IS_PRODUCTION) {
            return;
        }


        return Promise.all([ this.user.deleteMany() ]);
    }
}
