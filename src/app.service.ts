import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';

import config from './config';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  getHello(): string {
    const apikey = this.configService.apiKey;
    const dbName = this.configService.database.name;
    const port = this.configService.database.port;
    return `apiKey: ${apikey}, dbName: ${dbName} en el port: ${port}`;
  }
}
