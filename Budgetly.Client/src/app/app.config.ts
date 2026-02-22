import {
    ApplicationConfig, inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners
} from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/Lara';

import { routes } from './app.routes';
import {InitialDataService} from "./core/services/initial-data.service";
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideRouter(routes),
        providePrimeNG({
            theme: {
                preset: Lara
            }
        }),
        provideAppInitializer(() => {
            const initialDataService = inject(InitialDataService);
            void initialDataService.initializeAppData();
        })
    ]
};
