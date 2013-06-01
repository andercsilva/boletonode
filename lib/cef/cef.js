phpjs = require('phpjs').registerGlobals();

exports.sicob = function(dadosboleto, callback){
	//Dados do boleto para o seu cliente
	if(typeof dadosboleto == 'undefined') throw new Error('É necessário passar os parametros do boleto.');
	//Dias de prazo para o pagamento
	dadosboleto.dias_prazo_pagto = (typeof dadosboleto.dias_prazo_pagto != 'undefined')? dadosboleto.dias_prazo_pagto : 0;
	
	//Taxa do boleto
	dadosboleto.taxa = (typeof dadosboleto.taxa != 'undefined')? dadosboleto.taxa : 0;
	
	// Prazo de X dias  OU  informe data: "13/04/2006"  OU  informe "" se Contra Apresentacao;
	dadosboleto.data_venc = date("d/m/Y", time() + (dadosboleto.dias_prazo_pagto * 86400)); 

	if(typeof dadosboleto.valor_cobrado != 'undefined') {
		dadosboleto.valor_cobrado = str_replace(",", ".", dadosboleto.valor_cobrado);
	} else throw new Error('Valor cobrado não definido');


	// Carteira SR: 80, 81 ou 82  -  Carteira CR: 90 (Confirmar com gerente qual usar)
	if(typeof dadosboleto.inicio_nosso_numero == 'undefined') throw new Error('Inicio nosso número não definido');
	if (
		(dadosboleto.inicio_nosso_numero != "80") && 
		(dadosboleto.inicio_nosso_numero != "81") &&
		(dadosboleto.inicio_nosso_numero != "82") &&
		(dadosboleto.inicio_nosso_numero != "90")
		) throw new Error('Inicio nosso número incorreto. Deve ser 80, 81, 82 ou 90 (Confirmar com seu gerente)');
	
	// Nosso numero sem o DV - REGRA: Máximo de 8 caracteres!
	dadosboleto.nosso_numero = (typeof dadosboleto.nosso_numero != 'undefined')? dadosboleto.nosso_numero : "00000000";
	// Num do pedido ou do documento
	dadosboleto.numero_documento = (typeof dadosboleto.numero_documento != 'undefined')? dadosboleto.numero_documento : "00.000000.00";
	// Data de Vencimento do Boleto - REGRA: Formato DD/MM/AAAA
	dadosboleto.data_vencimento = dadosboleto.data_venc;
	// Data de emissão do Boleto
	dadosboleto.data_documento = (typeof dadosboleto.data_documento != 'undefined')? dadosboleto.data_documento : date("d/m/Y");
	// Data de processamento do boleto (opcional)
	dadosboleto.data_processamento = (typeof dadosboleto.data_processamento != 'undefined')? dadosboleto.data_processamento : date("d/m/Y");
	// Valor do Boleto - REGRA: Com vírgula e sempre com duas casas depois da virgula
	dadosboleto.valor_boleto = number_format(parseFloat(dadosboleto.valor_cobrado) + parseFloat(dadosboleto.taxa), 2, ',', '');

	//Dados do seu cliente
	dadosboleto.sacado = (typeof dadosboleto.sacado != 'undefined')? dadosboleto.sacado : "";
	dadosboleto.endereco1 = (typeof dadosboleto.endereco1 != 'undefined')? dadosboleto.endereco1 : "";
	dadosboleto.endereco2 = (typeof dadosboleto.endereco2 != 'undefined')? dadosboleto.endereco2 : "";

	//Informações para o cliente
	dadosboleto.demonstrativo1 = (typeof dadosboleto.demonstrativo1 != 'undefined')? dadosboleto.demonstrativo1 : "";
	dadosboleto.demonstrativo2 = (typeof dadosboleto.demonstrativo2 != 'undefined')? dadosboleto.demonstrativo2 : "";
	dadosboleto.demonstrativo3 = (typeof dadosboleto.demonstrativo3 != 'undefined')? dadosboleto.demonstrativo3 : "";

	//Instruções para o caixa
	dadosboleto.instrucoes1 = (typeof dadosboleto.instrucoes1 != 'undefined')? dadosboleto.instrucoes1 : "";
	dadosboleto.instrucoes2 = (typeof dadosboleto.instrucoes2 != 'undefined')? dadosboleto.instrucoes2 : "";
	dadosboleto.instrucoes3 = (typeof dadosboleto.instrucoes3 != 'undefined')? dadosboleto.instrucoes3 : "";
	dadosboleto.instrucoes4 = (typeof dadosboleto.instrucoes4 != 'undefined')? dadosboleto.instrucoes4 : "";

	//Dados opcionais de acordo com o banco ou cliente
	dadosboleto.quantidade = (typeof dadosboleto.quantidade != 'undefined')? dadosboleto.quantidade : "";
	dadosboleto.valor_unitario = (typeof dadosboleto.valor_unitario != 'undefined')? dadosboleto.valor_unitario : "";
	dadosboleto.aceite = (typeof dadosboleto.aceite != 'undefined')? dadosboleto.aceite : "";
	dadosboleto.especie = (typeof dadosboleto.especie != 'undefined')? dadosboleto.especie : "R$";
	dadosboleto.especie_doc = (typeof dadosboleto.especie_doc != 'undefined')? dadosboleto.especie_doc : "";

	//Dados fixos de configuração do seu boleto

	//Dados da sua conta - CEF
	// Num da agencia, sem digito
	dadosboleto.agencia = (typeof dadosboleto.agencia != 'undefined')? dadosboleto.agencia : "";
	// Num da conta, sem digito
	dadosboleto.conta = (typeof dadosboleto.conta != 'undefined')? dadosboleto.conta : "";
	// Digito do Num da conta
	dadosboleto.conta_dv = (typeof dadosboleto.conta_dv != 'undefined')? dadosboleto.conta_dv : "";

	//Seus personalizados - CEF
	// ContaCedente do Cliente, sem digito (Somente Números)
	dadosboleto.conta_cedente = (typeof dadosboleto.conta_cedente != 'undefined')? dadosboleto.conta_cedente : "";
	// Digito da ContaCedente do Cliente
	dadosboleto.conta_cedente_dv = (typeof dadosboleto.conta_cedente_dv != 'undefined')? dadosboleto.conta_cedente_dv : "";
	// Código da Carteira: pode ser SR (Sem Registro) ou CR (Com Registro) - (Confirmar com gerente qual usar)
	dadosboleto.carteira = (typeof dadosboleto.carteira != 'undefined')? dadosboleto.carteira : "";
	

	dadosboleto.identificacao = (typeof dadosboleto.identificacao != 'undefined')? dadosboleto.identificacao : "";
	dadosboleto.cpf_cnpj = (typeof dadosboleto.cpf_cnpj != 'undefined')? dadosboleto.cpf_cnpj : "";
	dadosboleto.endereco = (typeof dadosboleto.endereco != 'undefined')? dadosboleto.endereco : "";
	dadosboleto.cidade_uf = (typeof dadosboleto.cidade_uf != 'undefined')? dadosboleto.cidade_uf : "";
	dadosboleto.cedente = (typeof dadosboleto.cedente != 'undefined')? dadosboleto.cedente : "";

	require('./sicob').build(dadosboleto, function(html){
		callback(html);
	});
}
