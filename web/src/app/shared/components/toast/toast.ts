import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../core/services/error';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class ToastComponent {
  errors = this.errorService.errors;

  constructor(private errorService: ErrorService) {
    effect(() => {
      console.log('Errors updated:', this.errors());
    });
  }
}
