import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PaginationComponent {
  @Input() totalOrders = 0;
  @Input() totalPages = 0;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  constructor() {
  }

  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }
}
