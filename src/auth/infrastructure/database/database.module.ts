import { Module } from '@nestjs/common';
import { DatabaseService } from 'auth/infrastructure/database/database.service';

@Module({
    providers: [ DatabaseService ],
    exports: [ DatabaseService ],
})
export class DatabaseModule {

}
