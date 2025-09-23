import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  template: `
  <div *ngIf="toast" class="toast-message" [ngClass]="toast.type">
    {{ toast.text }}
  </div>
  `,
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toast: ToastMessage | null = null;
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.toastService.toastState$.subscribe(msg => {
      this.toast = msg;
      setTimeout(() => this.toast = null, 3000);
    });
  }

  constructor(private toastService: ToastService) {}

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
