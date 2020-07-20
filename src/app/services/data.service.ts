import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private router:Router) { }
  private data;
  private message;

  setData(data,messaje){
    this.data= data;
    this.message=messaje;
  }

  getData(){
    let temp = [this.data, this.message];
    this.clearData();
    return temp;
  }
  clearData(){
    this.data = undefined;
  }
}