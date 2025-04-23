import { Injectable } from '@nestjs/common';

@Injectable()
export class SystemService {
  getHello() {
    return 'Hello World!';
  }
}
