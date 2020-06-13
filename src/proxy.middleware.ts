import * as proxy from 'http-proxy-middleware';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  private proxy = proxy.createProxyMiddleware({
    logLevel: 'debug',
    pathRewrite: {
      '/proxy/todos': '/todos'// add more routes here
    },
    target: 'https://jsonplaceholder.typicode.com/',
    changeOrigin: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onProxyReq: (_proxyReq, req, _res) => {
      // you can see the incoming request and modifiy the 
      // request based on what SP is expecting
      console.log(
        `[Global Functional Middlware]: Proxying ${req.method} request originally made to '${req.originalUrl}'`
      );
    }
  })

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  use(_req: any, _res: any, next: () => void) {
    this.proxy(_req, _res, next);
  }
}
