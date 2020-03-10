import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  baseurl = 'http://10.54.223.18/api2db/?has-preferred=true&include-descriptions=true';

  // baseurl = 'http://localhost/api2db/?order-by=time-desc';

  // baseurl = 'http://10.54.223.18/api2db/';
  
  // baseurl = 'http://10.54.223.18/api2db/?has-preferred=true&include-descriptions=true'
  // + '&start-time=2020-02-01T00:00:00Z&end-time=2020-04-20T15:00:00Z&order-by=time-desc';
  
  // baseurl = 'http://127.0.0.1/api2db/5321/email_info';

  // 2020-02-01T00:00:00Z
  // 2020-04-20T15:00:00Z
 
  getList(ini: string, fin: string): Observable<Array<{}>> {
      
      return this.http.get<any>(this.baseurl + '&start-time=' + ini + '&end-time=' + fin + '&order-by=time-desc')
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  
  GetIssue(value): Observable<[{}]> {
    console.log('http://10.54.223.18/api2db/' + value + '/email_info');
    return this.http.get<any>('http://10.54.223.18/api2db/' + value + '/email_info')
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
