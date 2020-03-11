import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
// import { WebsocketService } from '../services/websocket.service';
// import { ConectaService } from '../services/conecta.service';
import { ListService } from '../shared/list.service';
import { Message } from '../message';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../environments/environment';
import { mergeMap, map, delay } from 'rxjs/operators';
import { of, Observable } from 'rxjs'; 

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  providers: [ NgxPaginationModule ],
  styleUrls: ['./analisis.component.css']
})
export class AnalisisComponent implements OnInit {

  title:string="Analisis";
  tabla: Array<{}>;
  ratios: Object;
  zona : Array<string>;

  p: number;

  // pag = 0; 
  // itemsPerPage: any; 
  // currentPage: any;

  my_server_ip = environment.my_server_ip; 

  periodForm = this.fb.group({

    fecha_ini : ['', [Validators.required]],
    fecha_fin : ['',  [Validators.required]],

    pversion : [false],
    status : ['_todos'],
    sensible: ['_ambos']
  });

  fecha_ini : string;
  fecha_fin : string;

  tipo='tabla';
  filedir:string;

  // cabecera : Array<String> = ['event_id','fecha_even','fecha_email','lat','lon','mag','mag_type','author','process_delay','email_delay','evaluation_status',
  // 'n20','n5','sensible','station_count','user','version'];

  cabecera : Array<String> = ['author'];

  pull() {

    this.tipo='file';
    const epochNow = (new Date).getTime();
    this.filedir = String(epochNow);
    "data"
    // this.dttService.send(mensaje);
  
  }

  make_period() {

    this.fecha_ini = this.periodForm.value['fecha_ini'];
    this.fecha_fin = this.periodForm.value['fecha_fin'];
    // console.log(`FECHAS : ${JSON.stringify(this.fecha_ini)} ${JSON.stringify(this.fecha_fin)}`); 
    return [this.fecha_ini , this.fecha_fin]
  }

  constructor(private fb: FormBuilder, private list: ListService ) { 
  }

  ngAfterViewInit() {
    
  };

  ngOnInit() {
   // this.list.getList().subscribe(data => {this.tabla = data}); 
  }
  out: Array<string|number|boolean>;

  onSubmit() {
  
    this.out = [];

    this.tipo='tabla'; 
    
    var period = this.make_period();
    
    let ini = period[0] + 'T00:00:00Z'; 
    let fin = period[1] + 'T23:59:59Z';
    
    console.log(this.periodForm.value);

    let pversion = this.periodForm.value['pversion'];
    let status = this.periodForm.value['status'];

    console.log(pversion, status);

    this.list.getList(ini, fin)
        .subscribe(
        data => {
           let sensible = [];
           data['data'].forEach((el: { [x: string]: any; }) => {
                  
                  el['descriptions'].forEach(e => { 
                        
                        // console.log(el['id'], e['type']); 
                        if (e['type']=='felt report') { sensible.push(el['id'])} 
                      });
                   
                  this.list.GetIssue(el['id']).subscribe( dat => { dat['data'].forEach((d: any) => {
                  
                  const d1 = new Date(d['mail_creation_time']);
                  const d2 = new Date(d['origin']['creation_info']['creation_time']);
                  const diff = Number((d1.valueOf() - d2.valueOf())/60).toFixed(2); 
                  
                  d['mail_creation_time'] = diff;
                  d['magnitude']['mag'] = Number(d['magnitude']['mag']).toFixed(1); 

                  d['origin']['latitude'] = Number(d['origin']['latitude']).toFixed(4);
                  d['origin']['longitude'] = Number(d['origin']['longitude']).toFixed(4);

                  d['origin']['depth']['value'] = Number(d['origin']['depth']['value']/1000).toFixed(1)

                  const esIgual = (element: number) => element == d['event_id'];
                  
                  d['sensible'] = ((sensible.findIndex(esIgual) === -1) ? false: true);

                  console.log(d['event_id'],d['magnitude']['evaluation_status']);
                  
                  if (pversion == true && d['version_solution'] == 0) { 
                                 this.out.push(d);
                                 
                  }
                  else if (pversion == false) {
                      this.out.push(d); 
                  }

                  if (status == '_todos') {  }

                })})
           });
           
         }
      );
  }
}