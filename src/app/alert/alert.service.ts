import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable()
export class AlertService {

  constructor() { }
  show(title: string, message: string,
    type: 'success' | 'error' | 'info' | 'warning' | 'question'): void {
    Swal.fire(title, message, type);
  }
}
