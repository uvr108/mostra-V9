import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
// import { WebsocketService } from '../services/websocket.service';
// import { ConectaService } from '../services/conecta.service';
import { ListService } from '../shared/list.service';
import { Message } from '../message';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../environments/environment';

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
    evaluation_status : ['_ambos'],
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

  value = []; 


  onSubmit() {
  
    this.tipo='tabla'; 
    
    // 2020-02-01T00:00:00Z
    // 2020-04-20T15:00:00Z

    var period = this.make_period();
    var between = [period[0] + 'T00:00:00Z' , period[1]+'T23:59:59+00:00:00Z','fecha_even'];
    var order = {'event_id':'desc','version':'desc'};
    var where={};
    var or={};

    
    if (this.periodForm.value.pversion) { 
        or['version'] = [0,null];
    }
    // alert(period[0]);
    // alert(period[1]);
    let ini = period[0] + 'T00:00:00Z'; 
    let fin = period[1] + 'T15:00:00Z';
    
    

    this.list.getList(ini, fin).subscribe(data => {
               this.tabla = data['data'];
               this.tabla.forEach(function (value) {
               
               this.value.push(value);  

              })
              this.value.forEach(function (val) { console.log(val)}) 
    });

    

  }



}

