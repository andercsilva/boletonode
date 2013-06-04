phpjs = require('phpjs').registerGlobals();

exports.build = function(dadosboleto, callback) {
  /**
  * Função de Calculo do Modulo 11 para geracao do digito verificador de boletos bancarios conforme documentos obtidos
  * da Febraban - www.febraban.org.br
  * Obs:
  * - Script desenvolvido sem nenhum reaproveitamento de código pré existente.
  * - Assume-se que a verificação do formato das variáveis de entrada é feita antes da execução deste script.
  * @num string numérica para a qual se deseja calcularo digito verificador;
  * @base integer valor maximo de multiplicacao [2-base]
  * @r integer quando especificado um devolve somente o resto
  * @return integer Retorna o Digito verificador
  * @author Pablo Costa <pablo@users.sourceforge.net>
  **/
  var modulo_11 = function(num, base, r) {
    base = base || 9;
    r = r || 0;
      soma = 0;
      fator = 2;
      numeros = array();
      parcial = array();
      /* Separacao dos numeros */
      for (i = strlen(num); i > 0; i--) {
          // pega cada numero isoladamente
          numeros[i] = substr(num,i-1,1);
          // Efetua multiplicacao do numero pelo falor
          parcial[i] = numeros[i] * fator;
          // Soma dos digitos
          soma += parcial[i];
          if (fator == base) {
              // restaura fator de multiplicacao para 2
              fator = 1;
          }
          fator++;
      }
      /* Calculo do modulo 11 */
      if (r == 0) {
          soma *= 10;
          digito = soma % 11;
          if (digito == 10) {
              digito = 0;
          }
          return digito;
      } else if (r == 1){
          resto = soma % 11;
          return resto;
      }
  }
 /* function split (delimiter, string) {
      // http://kevin.vanzonneveld.net
      // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // -    depends on: explode
      // *     example 1: split(' ', 'Kevin van Zonneveld');
      // *     returns 1: {0: 'Kevin', 1: 'van', 2: 'Zonneveld'}
      return this.explode(delimiter, string);
  }*/

  /**
  * Função do dígito verificados nosso número
  * @numero integer
  * @return integer
  **/
  var digitoVerificador_nossonumero = function(numero) {
    resto2 = modulo_11(numero, 9, 1);
       digito = 11 - resto2;
       if (digito == 10 || digito == 11) {
          dv = 0;
       } else {
          dv = digito;
       }
     return dv; 
  }

  /**
  * Função do dígito verificador barra
  * @numero integer
  * @return integer
  **/
  var digitoVerificador_barra = function(numero) 
  {
    resto2 = modulo_11(numero, 9, 1);
       if (resto2 == 0 || resto2 == 1 || resto2 == 10) {
          dv = 1;
       } else {
      dv = 11 - resto2;
       }
     return dv;
  }

  /**
  * Função para formatar números
  * @numero integer
  * @loop integer
  * @insert integer
  * @tipo string
  * @return integer
  **/
  var formata_numero = function(numero,loop,insert,tipo) 
  {
    tipo = tipo || "geral";
    if (tipo == "geral") {
      numero = str_replace(",","",numero);
      while(strlen(numero)<loop){
        numero = insert + numero;
      }
    }
    if (tipo == "valor") {
      /*
      retira as virgulas
      formata o numero
      preenche com zeros
      */
      numero = str_replace(",","",numero);
      while(strlen(numero)<loop){
        numero = insert + numero;
      }
    }
    if (tipo == "convenio") {
      while(strlen(numero)<loop){
        numero = numero + insert;
      }
    }
    return numero;
  }

  /** 
  * Função que gera as imagens do código de barras
  * @valor
  * @return html
  **/
  var fbarcode = function(valor)
  {
    //Tamanho das imagens
    fino = 1 ;
    largo = 3 ;
    altura = 50 ;
    barcodes = array();
    //Barcodes
    barcodes[0] = "00110" ;
    barcodes[1] = "10001" ;
    barcodes[2] = "01001" ;
    barcodes[3] = "11000" ;
    barcodes[4] = "00101" ;
    barcodes[5] = "10100" ;
    barcodes[6] = "01100" ;
    barcodes[7] = "00011" ;
    barcodes[8] = "10010" ;
    barcodes[9] = "01010" ;
    for(f1 = 9; f1 >= 0; f1--){

      for(f2 = 9; f2 >= 0; f2--){
        f = (f1 * 10) + f2 ;
        texto = "" ;
        for(i = 1; i < 6; i++){
          texto +=  substr(barcodes[f1],(i-1),1) + substr(barcodes[f2],(i-1),1);
        }
        barcodes[f] = texto;
      }
    }
    //Desenho da barra
    //Guarda inicial
    imagens = "<img src=/images/boleto/p.png width=" + fino + " height=" + altura + " border=0>";
    imagens += "<img src=/images/boleto/b.png width=" + fino + " height=" + altura + " border=0>";
    imagens += "<img src=/images/boleto/p.png width=" + fino + " height=" + altura + " border=0>";
    imagens += "<img src=/images/boleto/b.png width=" + fino + " height=" + altura + " border=0>";

    texto = valor ;
    if((strlen(texto) % 2) != 0) {
      texto = "0" + texto;
    }

    // Draw dos dados
    while (strlen(texto) > 0) {
      i = round(esquerda(texto,2));
      texto = direita(texto,strlen(texto)-2);
      f = barcodes[parseFloat(i)];
      for(i=1;i<11;i+=2) {

        if (substr(f,(i-1),1) == "0") {
          f1 = fino ;
        }else{
          f1 = largo ;
        }
        imagens += "<img src=/images/boleto/p.png width=" + f1 + " height=" + altura + " border=0>";
        if (substr(f,i,1) == "0") {
          f2 = fino ;
        }else{
          f2 = largo ;
        }
        imagens += "<img src=/images/boleto/b.png width=" + f2 + " height=" + altura + " border=0>";
      }

    }

    imagens += "<img src=/images/boleto/p.png width=" + largo + " height=" + altura + " border=0>";
    imagens += "<img src=/images/boleto/b.png width=" + fino + " height=" + altura + " border=0>";
    imagens += "<img src=/images/boleto/p.png width=1 height=" + altura + " border=0>";
    return imagens;
  } 

  /**
  * @entra string
  * @comp integer
  * @return string
  **/
  var esquerda = function(entra,comp) {
    return substr(entra,0,comp);
  }

  /**
  * @entra string
  * @comp integer
  * @return string
  **/
  var direita = function(entra,comp) {
    return substr(entra,strlen(entra)-comp,comp);
  }

  /**
  * Função fator vencimento
  * @data date
  * @return integer
  **/
  var fator_vencimento = function(data) {
    if (data != "") {
    data = explode("/",data);
    ano = parseFloat(data[2]);
    mes = parseFloat(data[1]);
    dia = parseFloat(data[0]);
    
    
      return(abs((_dateToDays(1997,10,07)) - (_dateToDays(ano, mes, dia))));
    } else {
      return "0000";
    }
  }

  /**
  * Função que retorna a data em dias
  * @year integer
  * @month integer
  * @day integer
  * @retun integer
  **/
  var _dateToDays = function(year,month,day) {
      century = substr(year, 0, 2);
      year = substr(year, 2, 2);
      if (month > 2) {
          month -= 3;
      } else {
          month += 9;
          if (year) {
              year--;
          } else {
              year = 99;
              century --;
          }
      }
      return ( floor((  146097 * century)    /  4 ) +
              floor(( 1461 * year)        /  4 ) +
              floor(( 153 * month +  2) /  5 ) +
                  day +  1721119);
  }

  // http://kevin.vanzonneveld.net
  // + original by: Marco Marchiò
  // * example 1: preg_split(/[\s,]+/, 'hypertext language, programming');
  // * returns 1: ['hypertext', 'language', 'programming']
  // * example 2: preg_split('//', 'string', -1, 'PREG_SPLIT_NO_EMPTY');
  // * returns 2: ['s', 't', 'r', 'i', 'n', 'g']
  // * example 3: var str = 'hypertext language programming';
  // * example 3: preg_split('/ /', str, -1, 'PREG_SPLIT_OFFSET_CAPTURE');
  // * returns 3: [['hypertext', 0], ['language', 10], ['programming', 19]]
  // * example 4: preg_split('/( )/', '1 2 3 4 5 6 7 8', 4, 'PREG_SPLIT_DELIM_CAPTURE');
  // * returns 4: ['1', ' ', '2', ' ', '3', ' ', '4 5 6 7 8']
  // * example 5: preg_split('/( )/', '1 2 3 4 5 6 7 8', 4, (2 | 4));
  // * returns 5: [['1', 0], [' ', 1], ['2', 2], [' ', 3], ['3', 4], [' ', 5], ['4 5 6 7 8', 6]]
  function preg_split (pattern, subject, limit, flags) {
      limit = limit || 0; flags = flags || ''; // Limit and flags are optional

      var result, ret=[], index=0, i = 0,
          noEmpty = false, delim = false, offset = false,
          OPTS = {}, optTemp = 0,
          regexpBody = /^\/(.*)\/\w*$/.exec(pattern.toString())[1],
          regexpFlags = /^\/.*\/(\w*)$/.exec(pattern.toString())[1];
          // Non-global regexp causes an infinite loop when executing the while,
          // so if it's not global, copy the regexp and add the "g" modifier.
          pattern = pattern.global && typeof pattern !== 'string' ? pattern :
              new RegExp(regexpBody, regexpFlags+(regexpFlags.indexOf('g') !==-1 ? '' :'g'));

      OPTS = {
          'PREG_SPLIT_NO_EMPTY': 1,
          'PREG_SPLIT_DELIM_CAPTURE': 2,
          'PREG_SPLIT_OFFSET_CAPTURE': 4
      };
      if (typeof flags !== 'number') { // Allow for a single string or an array of string flags
          flags = [].concat(flags);
          for (i=0; i < flags.length; i++) {
              // Resolve string input to bitwise e.g. 'PREG_SPLIT_OFFSET_CAPTURE' becomes 4
              if (OPTS[flags[i]]) {
                  optTemp = optTemp | OPTS[flags[i]];
              }
          }
          flags = optTemp;
      }
      noEmpty = flags & OPTS.PREG_SPLIT_NO_EMPTY;
      delim = flags & OPTS.PREG_SPLIT_DELIM_CAPTURE;
      offset = flags & OPTS.PREG_SPLIT_OFFSET_CAPTURE;

      var _filter = function(str, strindex) {
          // If the match is empty and the PREG_SPLIT_NO_EMPTY flag is set don't add it
          if (noEmpty && !str.length) {return;}
          // If the PREG_SPLIT_OFFSET_CAPTURE flag is set
          //      transform the match into an array and add the index at position 1
          if (offset) {str = [str, strindex];}
          ret.push(str);
      };
      // Special case for empty regexp
      if (!regexpBody){
          result=subject.split('');
          for (i=0; i < result.length; i++) {
              _filter(result[i], i);
          }
          return ret;
      }
      // Exec the pattern and get the result
      while (result = pattern.exec(subject)) {
          // Stop if the limit is 1
          if (limit === 1) {break;}
          // Take the correct portion of the string and filter the match
          _filter(subject.slice(index, result.index), index);
          index = result.index+result[0].length;
          // If the PREG_SPLIT_DELIM_CAPTURE flag is set, every capture match must be included in the results array
          if (delim) {
              // Convert the regexp result into a normal array
              var resarr = Array.prototype.slice.call(result);
              for (i = 1; i < resarr.length; i++) {
                  if (result[i] !== undefined) {
                      _filter(result[i], result.index+result[0].indexOf(result[i]));
                  }
              }
          }
          limit--;
      }
      // Filter last match
      _filter(subject.slice(index, subject.length), index);
      return ret;
  }  

  /**
  * @num integer
  * @retun integer
  **/
  var modulo_10 = function(num) {
      numtotal10 = 0;
      fator = 2;
      parcial10 = array();
      numeros = array();
      // Separacao dos numeros
      for (i = strlen(num); i > 0; i--) {
          // pega cada numero isoladamente
          numeros[i] = substr(num,i-1,1);
          // Efetua multiplicacao do numero pelo (falor 10)
          temp = numeros[i] * fator;
          temp0=0;
          ret = preg_split('//',temp.toString(),-1,'PREG_SPLIT_NO_EMPTY');
          ret.forEach(function(v, k){ temp0 = parseFloat(temp0) + parseFloat(v); });
          parcial10[i] = temp0; //numeros[i] * fator;
          // monta sequencia para soma dos digitos no (modulo 10)
          numtotal10 += parcial10[i];
          if (fator == 2) {
              fator = 1;
          } else {
              fator = 2; // intercala fator de multiplicacao (modulo 10)
          }
      }
      // várias linhas removidas, vide função original
      // Calculo do modulo 10
      resto = numtotal10 % 10;
      digito = 10 - resto;
      if (resto == 0) {
          digito = 0;
      }

      return digito;
  }

  /** 
  * Posição   Conteúdo
  * 1 a 3    Número do banco
  * 4        Código da Moeda - 9 para Real
  * 5        Digito verificador do Código de Barras
  * 6 a 9   Fator de Vencimento
  * 10 a 19 Valor (8 inteiros e 2 decimais)
  * 20 a 44 Campo Livre definido por cada banco (25 caracteres)
  * @codigo integer
  * @return string
  **/
  var monta_linha_digitavel = function(codigo) {
    // 1. Campo - composto pelo código do banco, código da moéda, as cinco primeiras posições
    // do campo livre e DV (modulo10) deste campo
    p1 = substr(codigo, 0, 4);
    p2 = substr(codigo, 19, 5);

    p3 = modulo_10(p1+p2);
    //console.log("p3:" + p3);
    p4 = p1 + p2 + p3;
    p5 = substr(p4, 0, 5);
    p6 = substr(p4, 5);
    campo1 = p5 + "." + p6;

    // 2. Campo - composto pelas posiçoes 6 a 15 do campo livre
    // e livre e DV (modulo10) deste campo
    p1 = substr(codigo, 24, 10);
    p2 = modulo_10(p1);
    p3 = p1 + p2;
    p4 = substr(p3, 0, 5);
    p5 = substr(p3, 5);
    campo2 = p4 + "." + p5;

    // 3. Campo composto pelas posicoes 16 a 25 do campo livre
    // e livre e DV (modulo10) deste campo
    p1 = substr(codigo, 34, 10);
    p2 = modulo_10(p1);
    p3 = p1 + p2;
    p4 = substr(p3, 0, 5);
    p5 = substr(p3, 5);
    campo3 = p4 + "." + p5;

    // 4. Campo - digito verificador do codigo de barras
    campo4 = substr(codigo, 4, 1);

    // 5. Campo composto pelo fator vencimento e valor nominal do documento, sem
    // indicacao de zeros a esquerda e sem edicao (sem ponto e virgula). Quando se
    // tratar de valor zerado, a representacao deve ser 000 (tres zeros).
    p1 = substr(codigo, 5, 4);
    p2 = substr(codigo, 9, 10);
    campo5 = p1 + p2;
    //console.log(campo1 + " " + campo2 + " " + campo3 + " " + campo4 + " " + campo5);
    return campo1 + " " + campo2 + " " + campo3 + " " + campo4 + " " + campo5;
  }

  /**
  * @numero integer
  * @retun string
  **/
  var geraCodigoBanco = function(numero) {
      parte1 = substr(numero, 0, 3);
      parte2 = modulo_11(parte1);
      return parte1 + "-" + parte2;
  }  


  var codigobanco = "104";
  var codigo_banco_com_dv = geraCodigoBanco(codigobanco);
  //console.log("codigo_banco_com_dv:" + codigo_banco_com_dv);
  var nummoeda = "9";
  var fator_vencimento = fator_vencimento(dadosboleto.data_vencimento);
  //console.log("data_vencimento:" + dadosboleto.data_vencimento);
  //console.log("fator_vencimento:" + fator_vencimento);

  //valor tem 10 digitos, sem virgula
  var valor = formata_numero(dadosboleto.valor_boleto.toString(),10,0,"valor");
  //console.log("valor:" + valor);
  //agencia é 4 digitos
  var agencia = formata_numero(dadosboleto.agencia,4,0);
  //console.log("agencia:" + agencia);
  //conta é 5 digitos
  var conta = formata_numero(dadosboleto.conta,5,0);
  //console.log("conta:" + conta);
  //dv da conta
  var conta_dv = formata_numero(dadosboleto.conta_dv,1,0);
  //console.log("conta_dv:" + conta_dv);
  //carteira é 2 caracteres
  var carteira = dadosboleto.carteira;
  //console.log("carteira:" + carteira);
  //conta cedente (sem dv) com 11 digitos   (Operacao de 3 digitos + Cedente de 8 digitos)
  var conta_cedente = formata_numero(dadosboleto.conta_cedente,11,0);
  //console.log("conta_cedente:" + conta_cedente);
  //dv da conta cedente
  var conta_cedente_dv = formata_numero(dadosboleto.conta_cedente_dv,1,0);
  //console.log("conta_cedente_dv:" + conta_cedente_dv);
  //nosso número (sem dv) é 10 digitos
  var nnum = dadosboleto.inicio_nosso_numero + formata_numero(dadosboleto.nosso_numero,8,0);
  //console.log("nnum:" + nnum);
  //nosso número completo (com dv) com 11 digitos
  var nossonumero = nnum + '-' + digitoVerificador_nossonumero(nnum);
  //console.log("nossonumero:" + nossonumero);

  // 43 numeros para o calculo do digito verificador do codigo de barras
  var dv = digitoVerificador_barra(codigobanco + nummoeda + fator_vencimento + valor + nnum + agencia + conta_cedente , 9, 0);
  //console.log("dv:" + dv);
  // Numero para o codigo de barras com 44 digitos
  var linha =  codigobanco + nummoeda + dv + fator_vencimento + valor + nnum + agencia + conta_cedente;
  //console.log("linha:" + linha);

  var agencia_codigo = agencia + " / " + conta_cedente + "-" + conta_cedente_dv;
  //console.log("agencia_codigo:" + agencia_codigo);

  dadosboleto.codigo_barras = fbarcode(linha);
  dadosboleto.linha_digitavel = monta_linha_digitavel(linha);
  dadosboleto.agencia_codigo = agencia_codigo;
  dadosboleto.nosso_numero = nossonumero;
  dadosboleto.codigo_banco_com_dv = codigo_banco_com_dv;

  var combyne = require('combyne');
  var tpl = __dirname + '/tpl/sicob.tpl';
  var fs = require('fs');
  fs.readFile(tpl , function (err, data) {
    if (err) {
      throw err; 
    }
    var tmpl = combyne(data.toString());
    callback(tmpl.render({ dadosboleto: dadosboleto }));
  });  
}