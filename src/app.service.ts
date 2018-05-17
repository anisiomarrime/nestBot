import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return 'Bot Iniciado, use o Telegram Web/Mobile para interagir.';
  }
}
