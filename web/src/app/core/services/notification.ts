import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error';

export interface AppNotification {
  type: NotificationType;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<AppNotification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  addNotification(type: NotificationType, message: string) {
    this._notifications.update(notifs => [
      ...notifs,
      { type, message, timestamp: new Date() }
    ]);

    // Auto-remove after 4s
    setTimeout(() => this.clearLast(), 4000);
  }

  success(message: string) {
    this.addNotification('success', message);
  }

  error(message: string) {
    this.addNotification('error', message);
  }

  clearLast() {
    this._notifications.update(notifs => notifs.slice(1));
  }

  clearAll() {
    this._notifications.set([]);
  }
}
