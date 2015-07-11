var fs = require('fs');

var Estados = {
    inicio      : /^\s*JUNTA\sELECTORAL$/,
    provincia   : /^\s*PROVINCIA\sDE\sBUENOS\sAIRES\s*$/,
    partido     : /^\s+(.+)\s*$/,
    lineaInterna: /^\s+LINEA\sINTERNA:(.+)\s*$/,
    seccion     : /^\s+SECCION:(.+)\s*$/,
    cargo       : /^\s+CARGO:(.+)\s*$/,
    candidato   : /^\s+(\d{5,9})\s+(\w)\s+(.+)$/,
    distrito    : /^\s+DISTRITO:(.+)\s*$/,
    vacio       : /^\s*$/
};

var analyzer = function(lines){

    var actual = {
        partido:''
    }

    function inicio(actual, i){
        while(! lines[i++].match(Estados.inicio));
        while(! lines[i++].match(Estados.provincia));
        return i;
    }

    function partido(actual, i){
        //console.log("Antes -> " + i);
        while(!lines[i++].trim());
        //console.log("Despues -> " + i);
        //console.log("Partido -> ", lines.length, i, lines[i].match(Estados.partido));
        actual.partido = lines[i -1].match(Estados.partido)[1];
        return i;
    }

    function lineaInterna(actual, i){
        while(!lines[i++].match(Estados.lineaInterna));
        actual.lineaInterna = lines[i -1].match(Estados.lineaInterna)[1];
        return i;
    }

    function seccion(actual, i){
        while(!lines[i++].match(Estados.seccion));
        actual.seccion = lines[i -1].match(Estados.seccion)[1];
        return i;
    }

    function cargo(actual, i){
        while(!lines[i++].match(Estados.cargo));
        actual.cargo = lines[i -1].match(Estados.cargo)[1];
        return i;
    }

    var resp    = [];
    var i       = 0;

    while(i < lines.length){
        i = inicio(actual, i);
        i = partido(actual, i);
        i = lineaInterna(actual, i);
        i = seccion(actual, i);
        i = cargo(actual, i);
        console.log(JSON.stringify(actual, null, '\t'));
        /*i = seccion(i);
        i = cargo(i);
        i = candidato(i);*/
    }
}




fs.readFile('texto.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var resp = analyzer(data.split('\n'));
});



