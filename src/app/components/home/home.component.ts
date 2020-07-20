import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  reservadas;
  identificador;
  agrupacion;
  simbolo;
  numero;

  //otras variables 
  cadena;
  tokens;
  bandera = true;
  iterator = 0;
  resultados = [];
  errorMessage;
  tipo;
  valor;

  data;
  message;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
  }
  evaluar() {
    this.cadena = this.cadena;
    if (this.cadena == undefined) {
      this.errorMessage = "No puso ningun dato";
      this.dataService.setData(this.resultados, this.errorMessage);
    } else {
      this.lexemas();
      this.dataService.setData(this.resultados, this.errorMessage);
      this.data = this.dataService.getData()[0];
      this.message = this.dataService.getData()[1];
      this.iterator = 0;
      this.resultados = [];
    }
  }

  lexemas() {
    var auxiCadena = this.cadena.split(" ");
    console.log("auxicadena " + auxiCadena);
    for (this.iterator = 0; this.iterator < auxiCadena.length; this.iterator++) {
      if (this.getTipo(auxiCadena[this.iterator])) {
        this.tokens = {
          "type":this.tipo,
          "value":this.valor
        }
        this.resultados.push(this.tokens);
        console.log(this.resultados)
      } else {
        this.errorMessage = "lexer error -> " + auxiCadena[this.iterator];
        console.log("lexer error -> " + auxiCadena[this.iterator]);
        break;
      }
    }

  }

  getTipo(cadena) {
    this.reservadas = /^CREAROBJETOS$|^PROPIEDADES$|^VALORES$|^ACCEDERATRIBUTOS$|^CREAROBJETO$/;
    this.identificador = /^[a-z]+$/i;
    this.agrupacion = /\(|\)/
    this.simbolo =/^,$|^:$/
    this.numero = /^[0-9]+$/
    if (this.validarTipo(cadena)) return true;
    return false;
  }

  validarTipo(cadena) {
    if (cadena.match(this.reservadas)) {
      this.errorMessage="Succesfully tokerized";
      this.tipo = "reservadas";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.identificador)) {
      this.errorMessage="Succesfully tokerized";
      this.tipo = "identificador";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.agrupacion)) {
      this.errorMessage="Succesfully tokerized";
      this.tipo = "agrupacion";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.simbolo)) {
      this.errorMessage="Succesfully tokerized";
      this.tipo = "simbolo";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.numero)) {
      this.errorMessage="Succesfully tokerized";
      this.tipo = "numero";
      this.valor = cadena;
      return true;
    } else {
      console.log("Tipos: " + false)
      return false

    }
  }
  


}
