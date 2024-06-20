import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { AdminModule } from './admin/admin.module';
import { BackgroundController } from './background/background.controller';
import { BackgroundModule } from './background/background.module';
import { Admin } from './admin/models/admin.model';
import { Background } from './background/models/background.model';
import { JwtModule } from '@nestjs/jwt';
import { FilesModule } from './files/files.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: String(process.env.POSTGRES_PASS),
      database: process.env.POSTGRES_DB,
      models: [Admin, Background],
      autoLoadModels: true,
      logging: false,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, '..', 'uploads'),
    }),
    JwtModule,
    FilesModule,
    AdminModule,
    BackgroundModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}