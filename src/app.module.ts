// import * as redisStore from 'cache-manager-redis-store';

import { CacheInterceptor, CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { ProxyMiddleware } from "./proxy.middleware";
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule,
    // add redis support
    CacheModule.register({
      ttl: 30, // seconds
      max: 50, // maximum number of items in cache.
      // store: redisStore,
      // host: 'localhost',
      // port: 6379,
    }),
    ConfigModule.forRoot()
  ],
  controllers: [
    AppController, HealthController
  ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer {
    return consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: '/proxy', method: RequestMethod.ALL });
  }
}
