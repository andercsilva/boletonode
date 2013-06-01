# Módulo BoletoNode

BoletoNode baseado no sistema BoletoPHP
Aqueles que tiverem interessados em cooperar por favor entrem em contato

Atualmente somente a CEF com problema no código de barras o restante está normal

# Exemplo

``` sh
exports.index = function(req, res){
	//Chama o boletonode
	boletonode = require('boletonode');

	dadosboleto = new Object();
	dadosboleto.dias_prazo_pagto = 5;
	dadosboleto.taxa = 2.95;
	dadosboleto.valor_cobrado = '2950,00';

	dadosboleto.inicio_nosso_numero = '80';
	dadosboleto.nosso_numero = "19525086";
	dadosboleto.numero_documento = "27.030195.10";

	dadosboleto.sacado = "Nome do seu Cliente";
	dadosboleto.endereco1 = "Endereço do seu Cliente";
	dadosboleto.endereco2 = "Cidade - Estado - CEP: 00000-000";

	dadosboleto.demonstrativo1 = "Pagamento de Compra na Loja Nonononono";
	dadosboleto.demonstrativo2 = "Mensalidade referente a nonon nonooon nononon";
	dadosboleto.demonstrativo3 = "NodeBoleto";

	dadosboleto.instrucoes1 = "- Sr. Caixa, cobrar multa de 2% após o vencimento";
	dadosboleto.instrucoes2 = "- Receber até 10 dias após o vencimento";
	dadosboleto.instrucoes3 = "- Em caso de dúvidas entre em contato conosco: xxxx@xxxx.com.br";
	dadosboleto.instrucoes4 = "&nbsp; Emitido pelo sistema Projeto BoletoPhp - www.boletophp.com.br";

	// DADOS DA SUA CONTA - CEF
	dadosboleto.agencia = "0998"; // Num da agencia, sem digito
	dadosboleto.conta = "1686"; 	// Num da conta, sem digito
	dadosboleto.conta_dv = "3"; 	// Digito do Num da conta

	// DADOS PERSONALIZADOS - CEF
	dadosboleto.conta_cedente = "437"; // ContaCedente do Cliente, sem digito (Somente Números)
	dadosboleto.conta_cedente_dv = "4"; // Digito da ContaCedente do Cliente
	dadosboleto.carteira = "SR";  // Código da Carteira: pode ser SR (Sem Registro) ou CR (Com Registro) - (Confirmar com gerente qual usar)

	// SEUS DADOS
	dadosboleto.identificacao = "BoletoPhp - Código Aberto de Sistema de Boletos";
	dadosboleto.cpf_cnpj = "";
	dadosboleto.endereco = "Coloque o endereço da sua empresa aqui";
	dadosboleto.cidade_uf = "Cidade / Estado";
	dadosboleto.cedente = "Coloque a Razão Social da sua empresa aqui";

  	boletonode.cef.sicob(dadosboleto, function(html){
  		res.send(html, { 'Content-Type': 'text/html' }, 200);	
  	});
  	
};
```
