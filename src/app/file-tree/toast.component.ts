import { Component, Input } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  template: ``,
  styles: [`
    .toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 1em 1.5em;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 1em;
      z-index: 9999;
      animation: fadein 0.3s;
    }
    .toast.success { background-color: #28a745; }
    .toast.error { background-color: #dc3545; }
    .toast.warning { background-color: #ffc107; color: black; }
    .close-btn {
      background: transparent;
      border: none;
      color: inherit;
      font-size: 1.2rem;
      cursor: pointer;
    }
    @keyframes fadein {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastComponent {
toast: { text: string; type: 'success' | 'error' | 'warning' } | null = null;
@Input() show: boolean = false;
  constructor(private toastService: ToastService) {
        this.toastService.toastState$.subscribe(t => this.toast = t);
  }

  close() {
    this.toast = null;
  }
}
