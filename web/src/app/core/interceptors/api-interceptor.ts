import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retryWhen, mergeMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from '../services/notification';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private notification: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer fake-token',
        'X-Request-Id': uuidv4()
      }
    });

    return next.handle(clonedReq).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((err, i) => {
            if (err.status >= 500 && err.status < 600 && i < 3) {
              const delayTime = Math.pow(2, i) * 1000;
              return timer(delayTime);
            }
            return throwError(() => err);
          })
        )
      ),
      catchError(err => {
        const message = err?.error?.message || err.statusText || 'Unknown error';
        this.notification.error(`API Error: ${message}`);
        return throwError(() => err);
      })
    );
  }
}
