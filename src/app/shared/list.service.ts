import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  
  my_server_ip = environment.my_server_ip;

  baseurl = `http://${this.my_server_ip}/api2db/?has-preferred=true&include-descriptions=true`;

  getList(ini: string, fin: string): Observable<Array<{}>> {
      
      return this.http.get<any>(this.baseurl + '&start-time=' + ini + '&end-time=' + fin + '&order-by=time-desc')
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  
  GetIssue(value): Observable<[{}]> {
    return this.http.get<any>(`http://${this.my_server_ip}/api2db/${value}/email_info`)
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
