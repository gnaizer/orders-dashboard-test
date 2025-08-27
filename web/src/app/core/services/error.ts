import {Injectable, signal} from '@angular/core';
import {AppError} from '../../shared/interfaces/error';

@Injectable({providedIn: 'root'})
export class ErrorService {
  private readonly _errors = signal<AppError[]>([]);

  readonly errors = this._errors.asReadonly();

  addError(message: string) {
    this._errors.update(errs => [
      ...errs,
      {message, timestamp: new Date()}
    ]);

    // Auto-clear after 5s
    setTimeout(() => this.clearLast(), 5000);
  }

  clearLast() {
    this._errors.update(errs => errs.slice(1));
  }

  clearAll() {
    this._errors.set([]);
  }
}
