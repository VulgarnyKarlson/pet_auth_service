import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerModule } from 'shared/logging/logger.module';

@Global()
@Module({ })
export class SharedModule {
    public static forRoot(): DynamicModule {
        return {
            module: SharedModule,
            imports: [ LoggerModule ],
            exports: [ LoggerModule ],
        }
    }
}
