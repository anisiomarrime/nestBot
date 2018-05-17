import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BotService implements OnModuleInit {

    private oldText = "";

    onModuleInit() {
        this.botMessage();
    }

    botMessage() { 
        process.env.NTBA_FIX_319 = "1";
        const TelegramBot = require('node-telegram-bot-api');
        const token = '598890786:AAF2UPUzrhWnMvinGuM-cTTldf5DmpF3t9M';
        const bot = new TelegramBot(token, { polling: true });

        bot.on('message', (msg) => {
            let respondido = false;
            let message = msg.text.toString().toLowerCase();

            if(this.oldText != ''){
                message = this.oldText + message;
            }

            if (message.includes("ola") || message.includes("Boa tarde")) {
                bot.sendMessage(msg.from.id, "Boa tarde " + msg.from.first_name + ", eu sou o robo da RPA Team do Telegram, Posso ajudá-lo com alguma coisa?");
                
                bot.sendMessage(msg.from.id, 'Hi, do you want to travel?', {
                    reply_markup: { keyboard: [['trigger'], ['Internet Banking']] }
                });
                respondido = true
            }

            if (message.includes("esqueci senha") || message.includes("recuperar senha") || message.includes("recupear password")) {
                if(message.includes("internet banking")){
                    bot.sendMessage( msg.from.id, "Simples, primeiro entre na página do Barclays, de seguida procure o link IBANKING – FORGOT PASSWORD e siga as instruções :)" );   
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

            if (message.includes("como alterar o idioma do barclays móvel?")) {
                bot.sendMessage(msg.chat.id, "Aceder ao BM. Opção 6 (outros) – Opção 2 (Lingua)");
                respondido = true
            }
            
            if (message.includes("como para ceder ao inbanking?") || message.includes("inbanking")) {
                bot.sendMessage(msg.from.id, "podes aceder usado o link http://barclays.co.mz");
                bot.sendMessage(msg.from.id, "tem que fazer o pré-registo online na página do Barclays,");
                respondido = true
            }

            if (message.includes("para qual fim foi o debito feito na minha conta?")) {
                bot.sendMessage(msg.from.id, "Pagamento de CC/ Pagamento de Loan/ cobrança de cheque,");
                bot.sendMessage(msg.from.id, "Porem tabem podes verificar os meios de subscricao assim assim ! certo ?");
                respondido = true
            }

            if (message.includes("efectuei o pagamento")) {
                bot.sendMessage(msg.from.id, "Os pagamentos de cc no Ibanking leva 24h para estar disponivel o valor no cc.");
                respondido = true
            }

            if(!respondido && message != '/start'){
                bot.sendMessage(msg.from.id, "Desculpa " + msg.from.first_name + " não percebi ?");
            }

            console.log(msg.from.first_name + ": " + msg.text)
        });
    }
}