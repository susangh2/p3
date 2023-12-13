import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { KnexModule } from 'nest-knexjs';
import { config } from 'dotenv';
import { env } from './env';
import { MealrecordModule } from './mealrecord/mealrecord.module';
import { SummaryModule } from './summary/summary.module';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth.module';
// import { GrantMiddleware } from '../src/grant.middleware';

config();
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve('public'),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve('photoUploads'),
    }),
    UserModule,
    MealrecordModule,
    KnexModule.forRoot({
      config: {
        client: 'postgresql',
        connection: {
          database: env.DB_NAME,
          user: env.DB_USERNAME,
          password: env.DB_PASSWORD,
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: 'knex_migrations',
        },
      },
    }),
    SummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // Apply the GrantMiddleware to all routes
//     consumer.apply(GrantMiddleware).forRoutes('*');
//   }
// }
export class AppModule {}
