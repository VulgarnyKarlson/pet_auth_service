import { Module } from '@nestjs/common';
import { HealthModule } from 'health/health.module';
import { SharedModule } from 'shared/shared.module';

@Module({
    imports: [
        SharedModule.forRoot(),
        HealthModule,
    ],
})
export class AppModule {}
