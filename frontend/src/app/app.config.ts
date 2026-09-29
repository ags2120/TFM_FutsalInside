import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { DataService } from './core/services/data.service';
import { ApiDataService } from './core/services/api-data.service';
import { MockDataService } from './core/services/mock-data.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    // Single source switch: every store asks for the abstract `DataService`
    // and gets whichever provider the environment points at. Flip `useApi`
    // in the environment file to run the whole app on the mock firmware.
    {
      provide: DataService,
      useClass: environment.useApi ? ApiDataService : MockDataService,
    },
  ],
};
