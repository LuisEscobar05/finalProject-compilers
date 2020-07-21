import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private router:Router) { }
  private dataLex;
  private messageLex;

  private statusMessage;
  private messageSin;

  private statusMessageSem;
  private messageSem;


  setDataLex(data,messaje){
    this.dataLex = data;
    this.messageLex = messaje;
  }

  getDataLex(){
    let temp = [this.dataLex, this.messageLex];
    this.clearData();
    return temp;
  }

  setDataSin(messaje, status){
    this.statusMessage = status;
    this.messageSin = messaje;
  }

  getDataSin(){
    let temp = [this.messageSin, this.statusMessage];
    this.clearData();
    return temp;
  }

  setDataSem(messaje,status){
    this.messageSem = messaje;
    this.statusMessageSem = status;
  }

  getDataSem(){
    let temp = [this.messageSem, this.statusMessageSem];
    this.clearData();
    return temp;
  }


  clearData(){
    this.dataLex = undefined;
  }
}