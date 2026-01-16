import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('pg.host'),
        port: configService.get<number>('pg.port'),
        username: configService.get<string>('pg.user'),
        password: configService.get<string>('pg.password'),
        database: configService.get<string>('pg.database'),
        schema: configService.get<string>('pg.schema'),
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
