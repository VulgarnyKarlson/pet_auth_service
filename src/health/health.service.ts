import { HttpService } from '@nestjs/axios';
import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { AppConfig } from 'config/app.config';

@Injectable()
export class HealthService implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(
        private readonly httpService: HttpService
    ) {

    }

    public async onApplicationShutdown(): Promise<void> {
        if (AppConfig.IS_PRODUCTION) {
            await this.httpService.get('http://127.0.0.1/notready').toPromise();
            console.log('Application shutdown');
        }
    }

    public async onApplicationBootstrap(): Promise<void> {
        if (AppConfig.IS_PRODUCTION) {
            process.send('ready');
            await this.httpService.get('http://127.0.0.1/ready').toPromise();
        }
    }

    public async healthCheck(): Promise<number> {
        const response = await this.httpService.get('http://127.0.0.1/status').toPromise();
        return response.status;
    }
}
