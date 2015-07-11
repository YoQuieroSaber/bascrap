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

    var resp    = [[ '"' + "Partido","Linea Interna", "Seccion", "Cargo",
         "Documento","Genero","Nombre"].join('","') + '"'];

    function inicio(actual, i){
        while(! lines[i++].match(Estados.inicio));
        while(! lines[i++].match(Estados.provincia));
        return i;
    }
    //FIXME: DRY
    function partido(actual, i){
        while(!lines[i++].trim());
        actual.partido = lines[i -1].match(Estados.partido)[1].trim();
        return i;
    }

    function lineaInterna(actual, i){
        while(!lines[i++].match(Estados.lineaInterna));
        actual.lineaInterna = lines[i -1].match(Estados.lineaInterna)[1].trim();
        return i;
    }

    function seccion(actual, i){
        while(!lines[i++].match(Estados.seccion));
        actual.seccion = lines[i -1].match(Estados.seccion)[1].trim();
        return i;
    }

    function imprimirFila(actual){
        var linea = [actual.partido, actual.lineaInterna, actual.seccion, actual.cargo, 
            actual.documento, actual.genero, actual.nombre]
        resp.push(linea.join(','));
    }

    function candidatos(actual, i){
        var salir;
        while(!salir){
            // Primero busco cargos
            var isCargo = lines[i].match(Estados.cargo);
            var isCandidato = lines[i].match(Estados.candidato);
            var salir = lines[i].match(Estados.inicio);

            if(isCargo){
                actual.cargo = isCargo[1].trim();
            } else if(isCandidato){
                actual.documento = isCandidato[1];
                actual.genero    = isCandidato[2];
                actual.nombre    = isCandidato[3];
                imprimirFila(actual);
            }
            i++;
        }
        return i;
    }

    var i       = 0;

    while(i < lines.length){
        try{
            i = inicio(actual, i);
            i = partido(actual, i);
            i = lineaInterna(actual, i);
            i = seccion(actual, i);
            i = candidatos(actual, i);
        } catch(e) {
            break; // Ver como evitar esto!
        }
    }

    return resp;
}


fs.readFile('texto.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var resp = analyzer(data.split('\n'));

  fs.writeFile("salida/legisladoresBA.csv", resp.join('\n'), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("La salida fue guardad en salida/legisladoresBA.csv");
    }); 
});



