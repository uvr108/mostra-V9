import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  // baseurl = 'http://localhost/api2db/?order-by=time-desc';

  baseurl = 'http://localhost/api2db/5321/email_info';

  

  getList(): Observable<Array<{}>> {
      console.log(this.baseurl);
      return this.http.get<any>(this.baseurl)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  constructor(private http: HttpClient) { }

  // Error handling
   errorHandl(error) {
   let errorMessage = '';
   if(error.error instanceof ErrorEvent) {
     // Get client-side error
     errorMessage = error.error.message;
   } else {
     // Get server-side error
     errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
   }
   console.log(errorMessage);
   return throwError(errorMessage);
}

}
