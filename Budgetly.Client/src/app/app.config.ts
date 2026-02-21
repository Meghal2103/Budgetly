import {
    ApplicationConfig, inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/Lara';

import { routes } from './app.routes';
import {InitialDataService} from "./core/services/initial-data.service";

const initialDataService = inject(InitialDataService);

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        providePrimeNG({
            theme: {
                preset: Lara
            }
        }),
        provideAppInitializer(() => {
            return initialDataService.initializeAppData();
        })
    ]
};
