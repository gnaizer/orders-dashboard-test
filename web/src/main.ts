import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { requestIdInterceptor } from './app/core/interceptors/request-id-interceptor';
import { errorInterceptor } from './app/core/interceptors/error-interceptor';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, requestIdInterceptor, errorInterceptor]),
    ),
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
