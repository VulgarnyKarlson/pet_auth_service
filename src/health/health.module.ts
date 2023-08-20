import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthController } from 'health/health.controller';
import { HealthService } from 'health/health.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    controllers: [ HealthController ],
    providers: [ HealthService ],
})
export class HealthModule {}
