import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage | null>();
  toastState$ = this.toastSubject.asObservable();

  show(text: string, type: 'success' | 'error' | 'warning' = 'success') {
    this.toastSubject.next({ text, type });
    setTimeout(() => this.clear(), 3000);
  }

  clear() {
    this.toastSubject.next(null);
  }
}
