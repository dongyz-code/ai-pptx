import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from '../config/config.service.js';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.get('pg.host'),
        port: configService.get('pg.port'),
        username: configService.get('pg.user'),
        password: configService.get('pg.password'),
        database: configService.get('pg.database'),
        schema: configService.get('pg.schema'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production', // 生产环境禁用
        logging: process.env.NODE_ENV === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    }),
  ],
})
export class DatabaseModule {}
