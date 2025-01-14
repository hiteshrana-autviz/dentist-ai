import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor() { }
  successToast(message: string) {
    Swal.fire({
      position: 'bottom-end',  
      icon: 'success',  
      title: message, 
      showConfirmButton: false, 
      timer: 1000,  
      toast: true,  
      timerProgressBar: true  
    });
  }

  successAlert(message: string) {
    Swal.fire({
      title: 'Success!',
      text: message, 
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745'  
    });
  }

  
  warningAlert(message: string) {
    Swal.fire({
      title: 'Warning!',
      text: message,  
      icon: 'warning', 
      confirmButtonText: 'OK',
      confirmButtonColor: '#ffc107'  
    });
  }

 
  errorAlert(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message, 
      icon: 'error', 
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545'  
    });
  }


  infoAlert(message: string) {
    Swal.fire({
      title: "Info",
      text: message,  
      icon: 'info', 
      confirmButtonText: 'OK',
      confirmButtonColor: '#17a2b8'  
    });
  }


  confirmAlert(title :string ,message: string, confirmCallback: () => void) {
    Swal.fire({
      title: title ? title :'Are you sure?',
      text: message,  
      icon: 'question', 
      showCancelButton: true,  
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#28a745',  
      cancelButtonColor: '#dc3545' 
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();  
      }
    });
  }
  confirmDelete(itemName: string): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#d33',  // Color for the confirm button
      cancelButtonColor: '#3085d6',  // Color for the cancel button
    });
  }

}

