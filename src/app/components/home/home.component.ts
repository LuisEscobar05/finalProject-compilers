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
  @ViewChild('p') p: ElementRef;
  @ViewChild('process') proccess: ElementRef;
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
  messageOutput;
  statusOutput;


  //var semantic
  saveString;
  saveIteratorCreateObjects = [];
  saveIteratorPropertis = [];
  saveIteratorValues = [];
  saveIteratorAttrib = [];
  flagAccesSemantic = false;
  flagAccesOutput = false;


  arrayObjects = [];
  arrayNameProperties = [];
  arrayNameAttribProperties = [];
  arrayParametersValuesAux = [];
  arrayParametersPropertiesAux = [];
  arrayObjectsAtrrib = [];
  arrayParametersAttribAux = [];

  rplCadena;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dataService: DataService, private pila: StackService) { }
  ngAfterViewInit() {
    console.log("afterinit");

  }
  ngOnInit(): void {
  }
  evaluar() {
    this.arrayObjects = [];
    this.arrayNameProperties = [];
    this.arrayNameAttribProperties = [];
    this.arrayParametersValuesAux = [];
    this.arrayParametersPropertiesAux = [];
    this.arrayObjectsAtrrib = [];
    this.arrayParametersAttribAux = [];
    this.flagAccesOutput = false;
    this.cadena = this.cadena;
    this.rplCadena = this.cadena;
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
      this.rplCadena = this.rplCadena.replace(/(\r\n|\n|\r)/gm, "")
      this.lexemas();
      this.dataService.setDataLex(this.resultadosLex, this.messageInfo);
      this.dataLex = this.dataService.getDataLex()[0];
      this.messageLex = this.dataService.getDataLex()[1];
      this.iterator = 0;
      this.resultadosLex = [];
      this.auxiCadena = this.rplCadena.split(" ");
      this.firstRule();
      this.iterator = 0;
      this.pila.clear();
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
      if (!this.flagAccesOutput) {
        this.statusOutput = "";
        this.messageOutput = "No se paso el analisis semantico";
        this.dataService.setDataOutput(this.messageOutput, this.statusOutput);
        this.messageOutput = this.dataService.getDataOutput()[0];
        this.statusOutput = this.dataService.getDataOutput()[1];
      } else {
        this.messageOutput = this.dataService.getDataOutput()[0];
        this.statusOutput = this.dataService.getDataOutput()[1];
        this.generateFile();
        this.arrayObjects = [];
        this.arrayNameProperties = [];
        this.arrayNameAttribProperties = [];
        this.arrayParametersValuesAux = [];
        this.arrayParametersPropertiesAux = [];
        this.arrayObjectsAtrrib = [];
        this.arrayParametersAttribAux = [];
        this.flagAccesOutput = false;
      }
    }
  }

  //methods lexer
  lexemas() {
    var auxiCadena = this.rplCadena.split(" ");
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
      this.messageInfo = "Lexic correct";
      this.tipo = "reservadas";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.identificador)) {
      this.messageInfo = "Lexic correct";
      this.tipo = "identificador";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.agrupacion)) {
      this.messageInfo = "Lexic correct";
      this.tipo = "agrupacion";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.simbolo)) {
      this.messageInfo = "Lexic correct";
      this.tipo = "simbolo";
      this.valor = cadena;
      return true;
    } else if (cadena.match(this.numero)) {
      this.messageInfo = "Lexic correct";
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
        this.saveIteratorAttrib[0] = this.iterator;
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
      this.saveIteratorAttrib[1] = this.iterator;
      this.popData()//pop A RestoValor final
      this.messageInfo = "Cadena aceptada";
      // this.proccess.nativeElement.anima;
      this.statusSin = "Sintax correct"
      this.flagAccesSemantic = true;
      this.semanticMethods();
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

  semanticMethods() {
    //Objects
    // console.log(this.saveIteratorAttrib);
    // console.log(this.saveString[this.saveIteratorAttrib[0]], this.saveString[this.saveIteratorAttrib[1]]);
    // var this.arrayObjects = new Array();
    var i = this.saveIteratorCreateObjects[0];

    var arrayValues = new Array();
    while (i < this.saveIteratorCreateObjects[1]) {
      if (this.saveString[i] != ",")
        this.arrayObjects.push(this.saveString[i]);
      i++;
    }
    console.log(this.arrayObjects);

    //properties
    var arrayObjectsProperties = new Array();
    var j = this.saveIteratorPropertis[0];
    var cadenita = "";
    while (j < this.saveIteratorPropertis[1]) {
      cadenita += this.saveString[j] + " ";
      j++
    }
    var m = 0;
    var cadnSplit = cadenita.split(" ");
    var arrayParametersProperties = new Array();
    var aum = [];
    while (m < cadnSplit.length) {
      if (cadnSplit[m] == "(") {
        aum.push(m - 1);
        arrayObjectsProperties.push(cadnSplit[m - 1]);
      }
      arrayParametersProperties.push(cadnSplit[m])
      m++;
    }

    for (var jj = 0; jj < aum.length; jj++) {
      arrayParametersProperties.splice(aum[jj], 1, '');
    }

    // console.log(arrayParametersProperties);
    console.log(arrayObjectsProperties);


    for (var ij = 0; ij < arrayParametersProperties.length; ij++) {
      if (arrayParametersProperties[ij] != "(" && arrayParametersProperties[ij] != "," && arrayParametersProperties[ij] != "") {
        this.arrayParametersPropertiesAux.push(arrayParametersProperties[ij]);
      }
    }

    console.log(this.arrayParametersPropertiesAux)

    var j2 = 0;
    var cont = 0;
    var arrayLengthProperties = new Array();
    while (j2 < this.arrayParametersPropertiesAux.length) {
      if (this.arrayParametersPropertiesAux[j2] == ")") {
        arrayLengthProperties.push(cont);
        cont = 0;
        j2++;
      }
      cont++;
      j2++;
    }

    var j2Aux = 0;
    while (j2Aux < this.arrayParametersPropertiesAux.length) {
      if (this.arrayParametersPropertiesAux[j2Aux] != ")") {
        this.arrayNameProperties.push(this.arrayParametersPropertiesAux[j2Aux]);
      }
      j2Aux++;
    }

    console.log(this.arrayNameProperties);


    //values
    var k = this.saveIteratorValues[0];
    var parametersValues = new Array();
    var arrayObjectsValues = new Array();

    var cadenita2 = "";
    while (k < this.saveIteratorValues[1]) {
      cadenita2 += this.saveString[k] + " ";
      k++
    }
    var m2 = 0;
    var cadnSplit2 = cadenita2.split(" ");
    var arrayParametersValues = new Array();
    var aum2 = [];
    var cx = 0;
    while (m2 < cadnSplit2.length) {
      if (cadnSplit2[m2] == "(") {
        aum2.push(m2 - 1)
        arrayObjectsValues.push(cadnSplit2[m2 - 1]);
      }
      arrayParametersValues.push(cadnSplit2[m2])
      m2++;
    }

    for (var jj = 0; jj < aum2.length; jj++) {
      arrayParametersValues.splice(aum2[jj], 1, '');
    }

    // console.log(arrayParametersValues);
    console.log(arrayObjectsValues);



    for (var ij = 0; ij < arrayParametersValues.length; ij++) {
      if (arrayParametersValues[ij] != "(" && arrayParametersValues[ij] != "," && arrayParametersValues[ij] != "") {
        this.arrayParametersValuesAux.push(arrayParametersValues[ij]);
      }
    }


    console.log(this.arrayParametersValuesAux)

    var k2 = 0;
    var cont2 = 0;
    var arrayLengthPropertiesValues = new Array();
    while (k2 < this.arrayParametersValuesAux.length) {
      if (this.arrayParametersValuesAux[k2] == ")") {
        arrayLengthPropertiesValues.push(cont2);
        cont2 = 0;
        k2++;
      }
      cont2++;
      k2++;
    }


    console.log(arrayLengthPropertiesValues);

    //ACCEDERATRIBUTOS


    var p = this.saveIteratorAttrib[0];
    var cadenita = "";
    while (p < this.saveIteratorAttrib[1]) {
      cadenita += this.saveString[p] + " ";
      p++
    }
    var c = 0;
    var cadnSplit3 = cadenita.split(" ");
    var arrayParametersAttrib = new Array();
    var auc = [];
    while (c < cadnSplit3.length) {
      if (cadnSplit3[c] == "(") {
        auc.push(c - 1);
        this.arrayObjectsAtrrib.push(cadnSplit3[c - 1]);
      }
      arrayParametersAttrib.push(cadnSplit3[c])
      c++;
    }

    for (var jj = 0; jj < auc.length; jj++) {
      arrayParametersAttrib.splice(auc[jj], 1, '');
    }

    // console.log(arrayParametersAttrib);
    console.log(this.arrayObjectsAtrrib);


    for (var ij = 0; ij < arrayParametersAttrib.length; ij++) {
      if (arrayParametersAttrib[ij] != "(" && arrayParametersAttrib[ij] != "," && arrayParametersAttrib[ij] != "") {
        this.arrayParametersAttribAux.push(arrayParametersAttrib[ij]);
      }
    }

    console.log(this.arrayParametersAttribAux)

    var j3 = 0;
    // var cont3 = 0;
    console.log(this.arrayParametersAttribAux.length);
    while (j3 < this.arrayParametersAttribAux.length) {
      if (this.arrayParametersAttribAux[j3] != ")") {
        this.arrayNameAttribProperties.push(this.arrayParametersAttribAux[j3]);
      }
      j3++;
    }

    console.log(this.arrayNameAttribProperties);



    //conditions 
    if (this.arrayObjects.length == arrayObjectsProperties.length) {
      this.statusSem = "Semantic correct";
      this.messageSem = "Todo correcto";
      this.flagAccesOutput = true;
      this.dataService.setDataSem(this.messageSem, this.statusSem);
      var ku = 0;
      var band = false;
      while (ku < this.arrayObjects.length) {
        if (this.arrayObjects[ku] == arrayObjectsProperties[ku]) {
          band = true;
        } else {
          band = false;
          ku++;
        }
        ku++;
      }
      if (!band) {
        this.statusSem = "Semantic incorrect";
        this.messageSem = "El nombre de los objetos de PROPIEDADES no coincide con el nombre de los objetos de CREAROBJETOS";
        this.flagAccesOutput = false;
        this.dataService.setDataSem(this.messageSem, this.statusSem);
      } else {
        if (this.arrayObjects.length != arrayObjectsValues.length) {
          this.statusSem = "Semantic incorrect";
          this.flagAccesOutput = false;
          this.messageSem = "El numero de objetos de VALORES no coincide con el numero de objetos en PROPIEDADES";
          this.dataService.setDataSem(this.messageSem, this.statusSem);
        } else {
          var ko = 0;
          var band2 = false;
          while (ko < arrayLengthProperties.length) {
            if (arrayLengthPropertiesValues[ko] == arrayLengthProperties[ko]) {
              band2 = true;
            } else {
              band2 = false;
              ko++;
            }
            ko++;
          }
          if (!band2) {
            this.statusSem = "Semantic incorrect";
            this.flagAccesOutput = false;
            this.messageSem = "El numero de parametros de los objetos de VALORES no coincide con el numero de parametros de los objetos de PROPIEDADES";
            this.dataService.setDataSem(this.messageSem, this.statusSem);
          } else {
            var ka = 0;
            var bande = false;
            while (ka < arrayObjectsProperties.length) {
              if (arrayObjectsValues[ka] == arrayObjectsProperties[ka]) {
                bande = true;
              } else {
                bande = false;
                ka++;
              }
              ka++;
            }
            if (!bande) {
              this.statusSem = "Semantic incorrect";
              this.flagAccesOutput = false;
              this.messageSem = "El nombre de los objetos de VALORES no coincide con el nombre de los objetos de PROPIEDADES";
              this.dataService.setDataSem(this.messageSem, this.statusSem);
            } else {
              if (this.arrayObjectsAtrrib.length > arrayObjectsValues.length) {
                this.statusSem = "Semantic incorrect";
                this.flagAccesOutput = false;
                this.messageSem = "El numero de objetos en ACCEDERATRIBUTOS no puede ser mayor que el de VALORES";
                this.dataService.setDataSem(this.messageSem, this.statusSem);
              } else {
                if (this.arrayNameAttribProperties.length > this.arrayNameProperties.length) {
                  this.statusSem = "Semantic incorrect";
                  this.flagAccesOutput = false;
                  this.messageSem = "El numero de parametros de ACCEDERATRIBUTOS no puede ser mayor al de PROPIEDADES";
                  this.dataService.setDataSem(this.messageSem, this.statusSem);
                } else {
                  var ka2 = 0;
                  var bande2 = true;
                  var tempInde = [];
                  while (ka2 < this.arrayNameAttribProperties.length) {
                    tempInde.push(this.arrayNameProperties.indexOf(this.arrayNameAttribProperties[ka2]))
                    ka2++;
                  }
                  for (var kj = 0; kj < tempInde.length; kj++) {
                    if (tempInde[kj] < 0) {
                      bande2 = false;
                    }
                  }

                  if (!bande2) {
                    this.statusSem = "Semantic incorrect";
                    this.flagAccesOutput = false;
                    this.messageSem = "El nombre de los parametros de ACCEDERATRIBUTOS no coincide con los de PROPIEDADES";
                    this.dataService.setDataSem(this.messageSem, this.statusSem);
                  }
                }
              }
            }
          }

        }
      }
    } else {
      this.statusSem = "Semantic incorrect";
      this.flagAccesOutput = false;
      this.messageSem = "El numero de objetos en PROPIEDADES no coincide con el numero de objetos en CREAROBJETOS";
      this.dataService.setDataSem(this.messageSem, this.statusSem);
    }

  }

  generateFile() {
    var msjObjects = "// Create an object\n";
    var j = 0;
    var p = 0;
    for (var i = 0; i < this.arrayObjects.length; i++) {
      msjObjects += "\nvar " + this.arrayObjects[i] + "= " + "{"
      console.log(j)
      while (j < this.arrayParametersPropertiesAux.length) {
        if (this.arrayParametersPropertiesAux[j] != ")") {
          msjObjects += "\n" + "\t" + this.arrayParametersPropertiesAux[j] + ":";
          msjObjects += "'" + this.arrayParametersValuesAux[j] + "'" + ",";
        } else {
          j++;
          break;
        }
        j++
      }
      msjObjects += "\n};\n";
    }

    msjObjects += "\n\n//Accesing Object Properties\n\n"
    var mi = 0;
    for (var m = 0; m < this.arrayObjectsAtrrib.length; m++) {
      while (mi < this.arrayParametersAttribAux.length) {
        if (this.arrayParametersAttribAux[mi] != ")") {
          var iniName = this.arrayObjectsAtrrib[m];
          console.log(iniName)
          msjObjects += "var " + iniName.charAt(0).toUpperCase() + this.arrayObjectsAtrrib[m] + "= ";
          msjObjects += this.arrayObjectsAtrrib[m] + "." + this.arrayParametersAttribAux[mi] + ";\n";
        } else {
          if (this.arrayParametersAttribAux[mi] == ")") {
            m++;
          }

        }
        mi++;
      }
    }

    this.messageOutput = msjObjects;
    var file = new File([this.messageOutput], "file.js", { type: "text/plain;charset=utf-8" });
    var url = window.URL.createObjectURL(file);
    this.statusOutput = "Generate file succes";
    this.a.nativeElement.href = url;
    this.a.nativeElement.innerHTML = "Download file.js";
    this.a.nativeElement.download = file.name;
    setTimeout(() => {
      this.p.nativeElement.append(this.a.nativeElement);
    }, 100);
    console.log(this.a.nativeElement.href)
  }

  test() {

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
