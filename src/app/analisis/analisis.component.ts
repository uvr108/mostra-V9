import { Component, OnInit, Input } from '@angular/core';
import {NgxPaginationModule} from 'ngx-pagination';
import { ListService } from '../shared/list.service';
import { Message } from '../message';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from './../../environments/environment';

import { DomSanitizer } from '@angular/platform-browser';

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
    sensible: ['_todos']
  });

  fecha_ini : string;
  fecha_fin : string;

  filedir:string = null;

  cabecera : Array<String> = ['author'];
  fileUrl: any;

  pull() {

    const epochNow = (new Date).getTime();
    this.filedir = String(epochNow);
    // console.log(this.filedir);
        
    const blob = new Blob([this.formatea()], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  
  }

  formatea() : string  {
    const cabeza = "event_id|author|creation|mag|type|st_count|status|latitude|longitude|dep|user|sensible|retardo|version\n";
    var salida: string = '';
    this.out.forEach(o => {
      const event_id = o['event_id'];
      const author = o['magnitude']['creation_info']['author'].trim();
      const creation = o['magnitude']['creation_info']['creation_time'].trim();
      const mag = o['magnitude']['mag'].trim();
      const type = o['magnitude']['type'].trim();
      const st_count = o['magnitude']['station_count'];
      const status = o['magnitude']['evaluation_status'].trim();
      const latitude = o['origin']['latitude'].trim();
      const longitude = o['origin']['longitude'].trim();
      const dep = o['origin']['depth']['value'].trim();
      const user = o['user'].trim();
      const sensible = o['sensible'];
      const retardo = o['mail_creation_time'].trim();
      const version = o['version_solution'];

      const out = `${event_id}|${author}|${creation}|${+mag}|${type}|${+st_count}|${status}|${+latitude}|${+longitude}|${+dep}|${user}|${sensible}|${+retardo}|${+version}\n`;
      salida = salida + out; 
        
    });
    return cabeza + salida;
  }

  make_period() {

    this.fecha_ini = this.periodForm.value['fecha_ini'];
    this.fecha_fin = this.periodForm.value['fecha_fin'];
 
    return [this.fecha_ini , this.fecha_fin]
  }

  constructor(private fb: FormBuilder, private list: ListService ,private sanitizer: DomSanitizer ) { 
  }

  ngAfterViewInit() {
    
  };

  ngOnInit() {}

  out: Array<string|number|boolean>
  sta : Array<number>;

  onSubmit() {

    this.filedir = null;
    this.out = [];

    var period = this.make_period();
    
    let ini = period[0] + 'T00:00:00Z'; 
    let fin = period[1] + 'T23:59:59Z';

    let pversion = this.periodForm.value['pversion'];
    let status = this.periodForm.value['status'];
    let sensible_ = this.periodForm.value['sensible'];

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

                  this.sta = [1,1,1];
                  // console.log(pversion, d['version_solution']);
                  if (pversion === true && +d['version_solution'] === 0) { 

                      this.sta[0] = 0;
                  }
                  else if (pversion == false) {
                      this.sta[0] = 0;
                  }
                                    
                  if (status == '_todos') { this.sta[1] = 0  }
                  if (status === '_preliminary' && d['magnitude']['evaluation_status'] === 'preliminary') { this.sta[1] = 0};
                  if (status === '_final' && d['magnitude']['evaluation_status'] === 'final') {this.sta[1] = 0};
                  if (status === '_reviewed' && d['magnitude']['evaluation_status'] === 'reviewed') {this.sta[1] = 0};
                  
                  // sensible
                  
                  if (sensible_ === '_todos') { this.sta[2] = 0};
                  if (sensible_ === '_si' && d['sensible'] == true) { this.sta[2] = 0};
                  if (sensible_ === '_no' && d['sensible'] == false) { this.sta[2] = 0};

                  d['sta'] = this.sta;
                  if ((+this.sta[0] + +this.sta[1] + +this.sta[2]) === 0) {
                      this.out.push(d);
                  }
                  
                })})
           });
                //   console.log(sensible); 
         }
      );
  }
}
