import { Injectable, OnModuleInit } from '@nestjs/common';
import { isNumber } from 'util';

@Injectable()                                                                                                                                           
export class BotService implements OnModuleInit {

    private oldText = "";
    private isLogged = false;
    private isOnATM = false;
    private passw = null;

    onModuleInit() {
        this.botMessage();
    }

    botMessage() { 
        process.env.NTBA_FIX_319 = "1";
        const TelegramBot = require('node-telegram-bot-api');
        const token = '598890786:AAF2UPUzrhWnMvinGuM-cTTldf5DmpF3t9M';
        const bot = new TelegramBot(token, { polling: true });

        bot.on('message', (msg) => {
            var saldoEnd;
            let respondido = false;
            let message = msg.text.toString().toLowerCase();

            var optionsAtm = {
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [{ text: 'Consulta de Saldo', callback_data: "consulta" }],
                    [{ text: 'Recuperar PIN', callback_data: 'pin' }],
                    [{ text: 'Transferência', callback_data: 'transferencia' }],
                    [{ text: 'Movimentos', callback_data: 'movimento' }]
                  ]
                })
            };
            
            let isPin = (parseInt(message) == 0 || parseInt(message).toString() == '0');
            if(isPin) this.setTeste();
            
            console.log("Eh Pin: " + isPin)

            if(!isPin){
                if (this.oldText != ''){
                    message = this.oldText + message;
                }

                var options = {
                    reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'ATM', callback_data: 'atm' }],
                        [{ text: 'Empréstimo', callback_data: 'emprestimo' }],
                        [{ text: 'Internet Banking', callback_data: "inbanking" }],
                    ]
                    })
                };

                if (message.includes("ola") || message.includes("Boa tarde")) {
                    bot.sendMessage(msg.from.id, "Boa tarde " + msg.from.first_name + ", eu sou o robo da RPA Team do Telegram, Posso ajudá-lo com alguma coisa?");
                    respondido = true
                }

                if (message.includes("esqueci senha") || message.includes("recuperar senha") || message.includes("recupear password")) {
                    if(message.includes("internet banking")){
                        bot.sendMessage( msg.from.id, "Simples, primeiro entre na página do Barclays, de seguida procure o link IBANKING – FORGOT PASSWORD e siga as instruções :)");   
                        this.oldText = '';
                    }
                    else if(message.includes("cartao de debito")){
                        bot.sendMessage( msg.from.id, "Dirija se a uma Agencia mais proxima leve com sigo o seu BI e seu cartao !" );   
                        bot.sendMessage( msg.from.id, "Identificamos uma Agencia para si, veja: https://www.google.co.mz/maps?rlz=1C5CHFA_enMZ731MZ731&q=barclays&um=1&ie=UTF-8&sa=X&ved=0ahUKEwiwrdPH_ozbAhWhJMAKHUQ5AhMQ_AUIDSgE" );   
                        this.oldText = '';
                    }
                    else{    
                        bot.sendMessage( msg.from.id, "Qual eh a senha que voce esqueceu ! " + msg.from.first_name );   
                        this.oldText = 'esqueci senha ';
                    }
                    respondido = true
                }

                if (message.includes("como alterar o idioma do barclays movel")) {
                    bot.sendMessage(msg.chat.id, "Aceder ao BM. Opção 6 (outros) – Opção 2 (Lingua)");
                    respondido = true
                }
                
                if (message.includes("Como aceder o serviço inbanking?") || message.includes("inbanking")) {
                    bot.sendMessage(msg.from.id, "podes aceder usado o link http://barclays.co.mz");
                    bot.sendMessage(msg.from.id, "tem que fazer o pré-registo online na página do Barclays,");
                    respondido = true
                }

                if(!respondido && message != '/start'){
                    bot.sendMessage(msg.from.id, "Desculpa " + msg.from.first_name + " não percebi ?");
                    bot.sendMessage(msg.from.id, "Podemos interagir consoante estes pontos: ", options);
                }

                if(message == '/start') bot.sendMessage(msg.from.id, "Olá " + msg.from.first_name + ", eu sou o robo da RPA Team do Telegram, Posso ajudá-lo com alguma coisa?", options);
            }

            if (this.getTeste()){
                if(!this.isLogged){
                    this.passw = message;
                    this.isLogged = true;
                    bot.sendMessage(msg.from.id, "Bem vindo " + msg.from.first_name + " " +  msg.from.last_name  +  " :-)", optionsAtm);
                }
            }
        });
        
        // Inline button callback queries
        bot.on('callback_query', function (msg) {

            var optionsAtm = {
                reply_markup: JSON.stringify({
                  inline_keyboard: [
                    [{ text: 'Consulta de Saldo - ATM', callback_data: "consulta" }],
                    [{ text: 'Recuperar PIN', callback_data: 'pin' }],
                    [{ text: 'Transferência', callback_data: 'transferencia' }],
                    [{ text: 'Movimentos', callback_data: 'movimento' }]
                  ]
                })
            };

            if(msg.data.includes("inbanking")){
                bot.answerCallbackQuery(msg.id, 'Internet Banking');
                bot.sendMessage(msg.from.id, "Para acederes o serviço Internet Banking, tem que fazer o pré-registo online na página do Barclays,");
                bot.sendMessage(msg.from.id, "para tal podes aceder usado o link http://barclays.co.mz");
                bot.sendMessage(msg.from.id, "fácil nao é ?");
            }

            if (msg.data.includes("more")) {
                bot.sendMessage(msg.from.id, "Por favor digite o seu pin de acesso:");
            }

            if (msg.data.includes("exit")) {
                var options = {
                    reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'ATM', callback_data: 'atm' }],
                        [{ text: 'Empréstimo', callback_data: 'emprestimo' }],
                        [{ text: 'Internet Banking', callback_data: "inbanking" }],
                    ]
                    })
                };
                bot.sendMessage(msg.from.id, "Se precisar de mais alguma coisa estou aqui :-)", options);
            }

            if(msg.data.includes("consulta")){
                bot.sendMessage(msg.from.id, "O seu Saldo: 12.564,00 MZN");
                var options = {
                    reply_markup: JSON.stringify({
                      inline_keyboard: [
                        [{ text: 'Sim', callback_data: "more" }],
                        [{ text: 'Nao', callback_data: "exit" }]
                      ]
                    })
                };
                bot.sendMessage(msg.from.id,"Mais alguma coisa no ATM ?", options);
            }

            if(msg.data.includes("atm")){
                bot.answerCallbackQuery(msg.id, 'ATM');
                if(!this.isLogged){
                    bot.sendMessage(msg.from.id, "Por favor digite o seu pin de acesso:");
                }
                else
                    bot.sendMessage(msg.from.id, "Bem vindo " + msg.from.first_name + " " +  msg.from.last_name  +  " :-)", optionsAtm);
            }

            if(msg.data.includes("poupanca")){
                bot.answerCallbackQuery(msg.id, 'Poupança');
                bot.sendMessage(msg.from.id, "Para acederes o serviço Internet Banking, tem que fazer o pré-registo online na página do Barclays,");
                bot.sendMessage(msg.from.id, "para tal podes aceder usado o link http://barclays.co.mz");
                bot.sendMessage(msg.from.id, "fácil nao é ?");
            }
        });
    }

    public getTeste(){
        return this.isOnATM;
    }
    
    public setTeste(){
        this.isOnATM = true;
    }

    private isExit(msg, bot){
        var options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: 'Sim', callback_data: "more" }],
                [{ text: 'Nao', callback_data: "exit" }]
              ]
            })
        };
        bot.sendMessage(msg.from.id,"Mais alguma coisa no ATM ?", options);
    }
}