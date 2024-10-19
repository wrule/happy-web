import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Filter, Options, RequestHandler } from 'http-proxy-middleware';

function prefixer(port: number) {
  const app = express();
  const proxyMiddleware = createProxyMiddleware<Request, Response>({
    target: 'http://www.baidu.com',
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
  });
  app.use('/jimao', proxyMiddleware);
  app.listen(port);
  console.log(`prefixer works on port`, port);
}

prefixer(8821);
