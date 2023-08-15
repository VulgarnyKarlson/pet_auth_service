import { Module } from '@nestjs/common';
import { AuthModule } from 'auth/auth.module';
import { HealthModule } from 'health/health.module';
import { SharedModule } from 'shared/shared.module';

@Module({
    imports: [
        SharedModule.forRoot(),
        AuthModule,
        HealthModule,
    ],
})
export class AppModule {}
