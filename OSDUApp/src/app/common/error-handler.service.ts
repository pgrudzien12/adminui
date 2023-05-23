import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  public errorHandler<T>() {
    return (error: any): Observable<T> => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // client-side error
        if (error.error != null) {
          if (error.error.message != undefined) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error: ${error.error}`;
          }
        }
      } else {
        if (error.error != null) {
          if (error.error.message != undefined) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
            errorMessage = `Error: ${error.error}`;
          }
        }
      }
      if (error.status == 0) {
      } else if (error.status == 401) {
        errorMessage =
          'Sorry. This user is not authorized to perform this function.';
      } else if (error.status == 400) {
        if (error['error']['message'] != undefined) {
          errorMessage = error['error']['message'];
        } else {
          errorMessage = error['error'];
          if (error['error'].includes('Expiration date')) {
            let temp = JSON.parse(error['error']);
            errorMessage = temp['errors'][0];
          }
        }
      }
      if (error.status == 404) {
        if (error.erro != null) {
          if (error['error']['message'] != undefined) {
            errorMessage = error['error']['message'];
          } else {
            errorMessage = error['error'];
          }
        } else {
          errorMessage = error['message'];
        }
      }
      if (error.status == 409) {
        if (error['error']['message'] != undefined) {
          errorMessage = error['error']['message'];
        } else {
          errorMessage = error['error'];
        }
      }
      if (error.status == 403) {
        if (error.error['reason'] == 'Access denied') {
          errorMessage = error.error['message'];
        }
      }

      return throwError(errorMessage);
    };
  }
}
