import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  totalPages = 0;
  pages: number[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;
    this.buildPages();
    console.log(this.totalItems);
  }

  private buildPages() {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    // Adjust start if we don’t have enough pages at the end
    start = Math.max(1, end - maxVisible + 1);

    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
