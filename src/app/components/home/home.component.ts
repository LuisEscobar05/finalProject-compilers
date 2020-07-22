import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { StackService } from 'src/app/services/stack.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //var expresiones regulares
  reservadas;
  identificador;
  agrupacion;
  simbolo;
  numero;
  @ViewChild('a') a: ElementRef;
  //var global
  cadena;
  iterator = 0;
  //var lex
  // cadena;
  tokens;
  // iterator 
  resultadosLex = [];
  messageInfo;
  tipo;
  valor;

  //var sin
  auxiCadena
  // messageInfo;
  message;
  transicion;
  resultadosSin = [];
  restoIdentificador;
  banderaDosPuntos = 0;
  banderaIdentificador = 0;
  banderaParentesisApertura = 0;
  banderaParentesisCierre = 0;
  banderaRestoIdentificador = 0;
  seconRoad = false;

  //services
  dataLex;
  messageLex;
  messageSin;
  messageSem;
  statusSem;
  statusSin;



  //var semantic
  saveString;
  saveIteratorCreateObjects = [];
  saveIteratorPropertis = [];
  saveIteratorValues = [];
  saveIteratorAttrib = [];
  flagAccesSemantic = false;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dataService: DataService, private pila: StackService) { }

  ngOnInit(): void {
  }
  evaluar() {
    this.cadena = this.cadena;
    this.cadena = this.cadena.replace(/(\r\n|\n|\r)/gm, "")
    this.iterator = 0;
    this.pila.clear();
    this.resultadosLex = [];
    this.resultadosSin = [];
    this.dataLex = "";
    this.messageLex = "";
    this.messageSin = "";
    this.statusSin = "";
    this.messageSem = "";
    this.statusSem = "";
    if (this.cadena == undefined) {
      this.messageInfo = "No puso ningun dato";
      this.dataService.setDataLex(this.resultadosLex, this.messageInfo);
      this.dataService.setDataSin(this.messageInfo, this.statusSin);
      this.dataLex = this.dataService.getDataLex()[0];
      this.messageLex = this.dataService.getDataLex()[1];
      this.messageSin = this.dataService.getDataSin()[0];
      this.statusSin = this.dataService.getDataSin()[1];
    } else {
      this.lexemas();
      this.dataService.setDataLex(this.resultadosLex, this.messageInfo);
      this.dataLex = this.dataService.getDataLex()[0];
      this.messageLex = this.dataService.getDataLex()[1];
      this.iterator = 0;
      this.resultadosLex = [];
      this.auxiCadena = this.cadena.split(" ");
      this.firstRule();
      this.iterator = 0;
      this.pila.clear();
      // console.log(this.pila.stack)
      this.messageSin = this.dataService.getDataSin()[0];
      this.statusSin = this.dataService.getDataSin()[1];
      console.log(this.messageSin)
      this.iterator = 0;
      this.resultadosSin = [];
      if (!this.flagAccesSemantic) {
        this.statusSem = "";
        this.messageSem = "No se paso el analisis sintactico";
        this.dataService.setDataSem(this.messageSem, this.statusSem);
        this.messageSem = this.dataService.getDataSem()[0];
        this.statusSem = this.dataService.getDataSem()[1];
      } else {
        this.messageSem = this.dataService.getDataSem()[0];
        this.statusSem = this.dataService.getDataSem()[1];
        this.flagAccesSemantic = false;
      }
    }
  }

  //methods lexer
  lexemas() {
    var auxiCadena = this.cadena.split(" ");
    this.saveString = auxiCadena;
    for (this.iterator = 0; this.iterator < auxiCadena.length; this.iterator++) {
      if (this.getTipo(auxiCadena[this.iterator])) {
        this.tokens = {
          "type": this.tipo,
          "value": this.valor
        }
        this.resultadosLex.push(this.tokens);
      } else {
        this.messageInfo = "lexer error -> " + auxiCadena[this.iterator];
        break;
      }
    }

  }
  getTipo(cadena) {
    this.reservadas = /^CREAROBJETOS$|^PROPIEDADES$|^VALORES$|^ACCEDERATRIBUTOS$|^CREAROBJETO$/;
    this.identificador = /^[a-z]+$/i;
    this.agrupacion = /\(|\)/
    this.simbolo = /^,$|^:$/
    this.numero = /^[0-9]+$/
    if (this.validarTipo(cadena)) return true;
    return false;
  }

  validarTipo(cadena) {
    if (cadena.match(this.reservadas)) {
      this.messageInfo = "Succesfully tokerized";
      this.tipo = "reservadas";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.identificador)) {
      this.messageInfo = "Succesfully tokerized";
      this.tipo = "identificador";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.agrupacion)) {
      this.messageInfo = "Succesfully tokerized";
      this.tipo = "agrupacion";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.simbolo)) {
      this.messageInfo = "Succesfully tokerized";
      this.tipo = "simbolo";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.numero)) {
      this.messageInfo = "Succesfully tokerized";
      this.tipo = "numero";
      this.valor = cadena;
      return true;
    } else {
      console.log("Tipos: " + false)
      return false

    }
  }

  //methods sintax

  firstRule() {
    this.banderaDosPuntos = 0;
    this.banderaRestoIdentificador = 0;
    this.banderaIdentificador = 0;
    this.banderaParentesisApertura = 0;
    this.banderaParentesisCierre = 0;
    this.pila.push("CREARACCEDERVALORES");
    this.pila.push(":");
    this.pila.push("ACCEDERATRIBUTOS");
    this.pila.push("ASIGNARVALORES");
    this.pila.push(":");
    this.pila.push("VALORES");
    this.pila.push("CREARACCEDERVALORES");
    this.pila.push(":");
    this.pila.push("PROPIEDADES");
    this.pila.push("CREAR");
    this.pila.push(":");
    this.pila.push("CREAROBJETOS");
    if (this.auxiCadena[this.iterator] == "CREAROBJETOS") {
      this.popData()// pop a CREAROBJETOS
      this.iterator++;
      this.validarDosPuntosCrearObjetos();
      this.dataService.setDataSin(this.messageInfo, this.statusSin);
    } else {
      this.flagAccesSemantic = false;
      this.statusSin = "Sintax error";
      this.messageInfo = "Error sintactico --> " + this.auxiCadena[this.iterator] + ", Deberia ser CREAROBJETOS";
      this.dataService.setDataSin(this.messageInfo, this.statusSin);
      this.iterator = 0;
      this.pila.clear();
    }
  }


  validarDosPuntosCrearObjetos() {
    if (this.expresionDospuntos()) {
      this.popData()// pop a :
      this.iterator++;
      this.validarCrear();
    } else {
      this.flagAccesSemantic = false;
      this.error();
    }
  }

  validarCrear() {
    if (this.expresionIdentificador()) {
      this.saveIteratorCreateObjects[0] = this.iterator;
      this.popData()// pop a CREAR
      this.pushData("RestoIdentificador");
      this.pushData("Identificador");
      this.popData()// Identificador
      this.iterator++;
      this.validarRestoIdentificadorCrear();
    } else {
      this.flagAccesSemantic = false;
      this.error();
    }
  }

  validarRestoIdentificadorCrear() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.iterator++;
      if (this.expresionIdentificador()) {
        this.iterator++;
        this.validarRestoIdentificadorCrear();
      } else {
        this.flagAccesSemantic = false;
        this.error()
      }
    } else {
      if (this.auxiCadena[this.iterator] == "PROPIEDADES") {
        this.saveIteratorCreateObjects[1] = this.iterator;
        this.popData()// pop a RestoIdentificador
        this.popData()//pop a PROPIEADES
        this.iterator++;
        this.saveIteratorPropertis[0] = this.iterator + 1;
        if (this.expresionDospuntos()) {
          this.popData(); //pop a :
          this.iterator++;
          this.validarCrearAccederValoresPropiedades();
        } else {
          this.flagAccesSemantic = false;
          this.error();
        }
      } else {
        this.flagAccesSemantic = false;
        this.popData()// pop a RestoIdentificador
        this.error();
      }
    }
  }

  validarCrearAccederValoresPropiedades() {
    if (this.expresionIdentificador()) {
      this.popData() // pop a CREARACCEDERVALORES
      this.pushData("RestoValor");
      this.pushData(")");
      this.pushData("RestoIdentificador");
      this.pushData("Identificador");
      this.pushData("(");
      this.pushData("Identificador");
      this.popData()//pop a Identificador;
      this.iterator++;
      if (this.expresionParentesisApertura()) {
        this.popData()//pop a (
        this.iterator++;
        if (this.expresionIdentificador()) {
          this.popData()//pop a identificador
          this.iterator++;
          this.validarRestoIdentificadorCrearAccederValores();
        } else {
          this.flagAccesSemantic = false;
          this.error();
        }
      } else {
        this.flagAccesSemantic = false;
        this.error();
      }
    } else {
      this.flagAccesSemantic = false;
      this.error();
    }
  }

  validarRestoIdentificadorCrearAccederValores() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.iterator++;
      if (this.expresionIdentificador()) {
        this.iterator++;
        this.validarRestoIdentificadorCrearAccederValores();
      } else {
        this.flagAccesSemantic = false;
        this.error()
      }
    } else {
      console.log(this.auxiCadena[this.iterator])
      if (this.expresionParentesisCierre()) {
        this.popData()// pop a RestoIdentificador
        this.iterator++;
        this.popData()//pop a )
        this.validarRestoValor1();
      } else {
        this.flagAccesSemantic = false;
        this.popData()// pop a RestoIdentificador
        this.error();
      }
    }
  }

  validarRestoValor1() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.popData()//pop a restoValor
      this.iterator++;
      this.validarCrearAccederValoresPropiedades();
    } else if (this.auxiCadena[this.iterator] == "VALORES") {
      this.saveIteratorPropertis[1] = this.iterator;
      this.popData()//pop a VALORES;
      this.iterator++;
      this.saveIteratorValues[0] = this.iterator + 1;
      if (this.expresionDospuntos()) {
        this.popData()//pop a :
        this.iterator++;
        this.validarAsignarValores();
      } else {
        this.flagAccesSemantic = false;
        this.error();
      }
    }
  }

  validarAsignarValores() {
    if (this.expresionIdentificador()) {
      this.popData()//pop ASIGNARVALORES
      this.pushData("RestoAsignarValores");
      this.pushData(")");
      this.pushData("TipoAtributo");
      this.pushData("(");
      this.pushData("Identificador");
      this.popData()//pop a Identificador
      this.iterator++;
      if (this.expresionParentesisApertura()) {
        this.popData()//pop a (
        this.iterator++;
        this.validarTipoAtributo();
      } else {
        this.flagAccesSemantic = false;
        this.error();
      }
    } else {
      this.flagAccesSemantic = false;
      this.error();
    }
  }

  validarTipoAtributo() {
    if (this.expresionIdentificador()) {
      this.popData()//pop a TipoAtributo
      this.pushData("RestoTipoAtributo");
      this.pushData("Identificador");
      this.popData()//pop a Identificador
      this.iterator++;
      this.validarRestoTipoAtributo();
    } else if (this.expresionNumero()) {
      this.popData()//pop a TipoAtributo
      this.pushData("RestoTipoAtributo");
      this.pushData("Numero");
      this.popData()//pop a Numero
      this.iterator++;
      this.validarRestoTipoAtributo();
    } else if (this.auxiCadena[this.iterator] == "CREAROBJETOS") {
      this.popData()//pop a TipoAtributo
      this.pushData("RestoTipoAtributo");
      this.pushData("S");
      this.popData()//pop S
      // console.log(this.auxiCadena[this.iterator])
      this.firstRule();
      this.validarRestoTipoAtributo();
    } else {
      this.flagAccesSemantic = false;
      console.log("a")
      this.error();
    }
  }

  validarRestoTipoAtributo() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.popData()//pop a RestoTipoAtributo
      this.iterator++;
      this.pushData("TipoAtributo");
      this.pushData(",");
      this.popData()//pop a ,
      this.validarTipoAtributo()
    } else if (this.expresionParentesisCierre()) {
      this.popData()//pop a RestoTipoAtributo
      this.iterator++;
      this.popData()//pop a )
      this.validarRestoAsignarValores();
    } else {
      this.flagAccesSemantic = false;
      this.popData()// pop a RestoIdentificador
      this.error()
    }
  }

  validarRestoAsignarValores() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.iterator++;
      if (this.expresionIdentificador()) {
        this.validarAsignarValores();
      } else {
        this.flagAccesSemantic = false;
        this.error()
      }
    } else {
      if (this.auxiCadena[this.iterator] == "ACCEDERATRIBUTOS") {
        this.popData()//pop A RestoAsignarValores
        this.validarAccederAtributos();
      } else {
        this.flagAccesSemantic = false;
        this.popData()// pop a RestoIdentificador
        this.error();
      }
    }
  }

  validarAccederAtributos() {
    if (this.auxiCadena[this.iterator] == "ACCEDERATRIBUTOS") {
      this.popData()//pop a ACCEDERATRIBUTOS;
      this.saveIteratorValues[1] = this.iterator;
      this.iterator++;
      if (this.expresionDospuntos()) {
        this.popData()//pop a :
        this.iterator++;
        this.validarCrearAccederValoresAccederAtributos();
      } else {
        this.flagAccesSemantic = false;
        this.error();
      }
    } else {
      this.flagAccesSemantic = false;
      this.error();
    }
  }

  validarCrearAccederValoresAccederAtributos() {
    if (this.expresionIdentificador()) {
      this.popData() // pop a CREARACCEDERVALORES
      this.pushData("RestoValor");
      this.pushData(")");
      this.pushData("RestoIdentificador");
      this.pushData("Identificador");
      this.pushData("(");
      this.pushData("Identificador");
      this.popData()//pop a Identificador;
      this.iterator++;
      if (this.expresionParentesisApertura()) {
        this.popData()//pop a (
        this.iterator++;
        if (this.expresionIdentificador()) {
          this.popData()//pop a identificador
          this.iterator++;
          this.validarRestoIdentificadorAccederAtributos();
        } else {
          this.flagAccesSemantic = false;
          this.error();
        }
      } else {
        this.flagAccesSemantic = false;
        this.error();
      }
    } else {
      this.flagAccesSemantic = false;
      this.error();
    }
  }

  validarRestoIdentificadorAccederAtributos() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.iterator++;
      if (this.expresionIdentificador()) {
        this.iterator++;
        this.validarRestoIdentificadorAccederAtributos();
      } else {
        this.flagAccesSemantic = false;
        this.error()
      }
    } else {
      if (this.expresionParentesisCierre()) {
        this.popData()// pop a RestoIdentificador
        this.popData()//pop a )
        this.iterator++;
        console.log(this.auxiCadena[this.iterator]);
        this.validarRestoValor2();
      } else {
        this.flagAccesSemantic = false;
        this.popData()// pop a RestoIdentificador
        this.error();
      }
    }
  }

  validarRestoValor2() {
    if (this.auxiCadena[this.iterator] == ",") {
      this.popData()//pop a restoValor
      this.iterator++;
      this.validarCrearAccederValoresAccederAtributos();
    } else if (this.auxiCadena[this.iterator] == undefined || this.auxiCadena[this.iterator] == " ") {
      this.popData()//pop A RestoValor final
      this.messageInfo = "Cadena aceptada";
      this.statusSin = "Sintax correct"
      this.flagAccesSemantic = true;
      this.init();
    }
  }

  expresionIdentificador() {
    this.identificador = /^[a-z]+$/;
    if (this.identificador.test(this.auxiCadena[this.iterator]) && this.auxiCadena[this.iterator] != undefined) {
      return true;
    } else {
      return false;
    }
  }

  expresionNumero() {
    this.numero = /^[\d]+$/
    if (this.numero.test(this.auxiCadena[this.iterator])) {
      return true;
    } else {
      return false;
    }
  }

  expresionDospuntos() {
    var dos = /^:$/
    if (this.auxiCadena[this.iterator] == ":") {
      return true;
    } else {
      return false;
    }
  }

  expresionParentesisApertura() {
    var aper = /^\($/
    if (this.auxiCadena[this.iterator] == "(") {
      return true;
    } else {
      return false;
    }
  }
  expresionParentesisCierre() {
    var cierr = /^\($/
    if (this.auxiCadena[this.iterator] == ")") {
      return true;
    } else {
      return false;
    }
  }

  pushData(dato) {
    this.pila.push(dato);
    this.message = "entra: " + this.pila.peek();
    this.transicion = [this.message];
    this.resultadosSin.push(this.transicion);
  }

  popData() {
    this.message = "sale: " + this.pila.peek();
    this.pila.pop();
    this.transicion = [this.message];
    this.resultadosSin.push(this.transicion);
  }

  error() {
    this.statusSin = "Sintax error";
    this.messageInfo = "Error sintactico--> " + this.auxiCadena[this.iterator] + ", Deberia ser: " + this.pila.peek();
  }

  //methods semantic

  init() {
    //Objects
    // console.log(this.saveIteratorValues);
    // console.log(this.saveString[this.saveIteratorValues[0]], this.saveString[this.saveIteratorValues[1]]);
    var arrayObjects = new Array();
    var i = this.saveIteratorCreateObjects[0];

    var arrayValues = new Array();
    while (i < this.saveIteratorCreateObjects[1]) {
      if (this.saveString[i] != ",")
        arrayObjects.push(this.saveString[i]);
      i++;
    }
    console.log(arrayObjects);

    //properties
    var arrayObjectsProperties = new Array();
    var j = this.saveIteratorPropertis[0];
    var cadenita="";
    while(j<this.saveIteratorPropertis[1]){
      cadenita += this.saveString[j]+" ";
      j++
    }
    var m = 0;
    var cadnSplit = cadenita.split(" ");
    while(m < cadnSplit.length){
      if(cadnSplit[m]=="("){
        arrayObjectsProperties.push(cadnSplit[m-1]);
      }
      m++;
    }



    
    console.log(arrayObjectsProperties);

    //values
    var k = this.saveIteratorValues[0];
    var parametersValues = new Array();
    var arrayObjectsValues = new Array();

    var cadenita2="";
    while(k<this.saveIteratorValues[1]){
      cadenita2 += this.saveString[k]+" ";
      k++
    }
    var m2 = 0;
    var cadnSplit2 = cadenita2.split(" ");
    var arrayParametersValues = new Array();
    var aum2 = [];
    var cx=0;
    while(m2 < cadnSplit2.length){
      if(cadnSplit2[m2]=="("){
        aum2.push(m2-1)
        arrayObjectsValues.push(cadnSplit2[m2-1]);
      }
      arrayParametersValues.push(cadnSplit2[m2])
      m2++;
    }
    
    for (var jj = 0; jj<aum2.length;jj++){
      arrayParametersValues.splice(aum2[jj],1,'');
    }

    console.log(arrayParametersValues);
    console.log(arrayObjectsValues);

    var arrayParametersValuesAux = new Array();

 
    for ( var ij = 0 ; ij <arrayParametersValues.length;ij++){
      if(arrayParametersValues[ij]!="(" && arrayParametersValues[ij]!="," && arrayParametersValues[ij]!=""){
        arrayParametersValuesAux.push(arrayParametersValues[ij]);
      }
    }

    
    console.log(arrayParametersValuesAux)

    var k2 = 0;
    var cont2 = 0;
    var arrayLengthPropertiesValues = new Array();
    while (k2 < arrayParametersValuesAux.length) {
      if ( arrayParametersValuesAux[k2]==")") {
        arrayLengthPropertiesValues.push(cont2);
        cont2 = 0;
        k2++;
      }
      cont2++;
      k2++;
    }

    console.log(arrayLengthPropertiesValues);

    //conditions 
    if (arrayObjects.length == arrayObjectsProperties.length) {
      this.statusSem = "Semantic correct";
      this.messageSem = "Todo correcto";
      this.dataService.setDataSem(this.messageSem, this.statusSem);
    } else {
      this.statusSem = "Semantic incorrect";
      this.messageSem = "El numero de objetos no coincide con el numero de objetos en propiedades";
      this.dataService.setDataSem(this.messageSem, this.statusSem);
    }
    



  }

  test() {
    var ss = "var car = { name: 'ford'}"
    // creas el fichero con la API File
    var file = new File([ss], "hello world.js", { type: "text/plain;charset=utf-8" });

    // obtienes una URL para el fichero que acabas de crear
    var url = window.URL.createObjectURL(file);

    // // creas un enlace y lo añades al documento
    // var a = document.createElement("a");
    // document.body.appendChild(a);

    // actualizas los parámetros del enlace para descargar el fichero creado
    this.a.nativeElement.href = url;
    this.a.nativeElement.innerHTML = "Descargar archivo.js";
    this.a.nativeElement.download = file.name;
    console.log(this.a.nativeElement.href)
  }

  // Ejemplo de entrada:
  // CREAROBJETOS: person, car
  // PROPIEDADES: person (firstName, lastName, age), car ( model, color, type )
  // VALORES: person (John, Doe, 50), car ( 500, white,
  // CREAROBJETO: type
  // PROPIEDADES: type (name, year)
  // VALORES: type (Nissan, 2009)
  // ACCEDERATRIBUTOS: type (name, year) )
  // ACCEDERATRIBUTOS: person (firstName, lastName), car (type, model)


  //Numero de propiedades = numero de CrearObjetos
  //Que el nombre de los objetos en propiedades sea = al de CrearObjetos
  //Numero de valores parametros = numero de propiedades
  //Numero de valores como objeto = numero de Propiedades o de objetos
  //Acceder a atributos como minino debe ser 1 y que el nombre del atributo sea igual al de la propiedad 

}
