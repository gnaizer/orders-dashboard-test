import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { OrdersStore } from './core/state/orders-store';
import { OrdersService } from './core/services/orders';
import { NotificationService } from './core/services/notification';
import { ApiInterceptor } from './core/interceptors/api-interceptor';
import { ErrorService } from './core/services/error';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    OrdersStore,
    OrdersService,
    NotificationService,
    ErrorService,
    ApiInterceptor
  ]
};
