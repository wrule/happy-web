import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Filter, Options, RequestHandler } from 'http-proxy-middleware';

type ProxyConfig = Parameters<typeof createProxyMiddleware<Request, Response>>[0];
interface ProxyConfigExt extends ProxyConfig {
  prefix: string;
}

function prefixer(port: number) {
  const app = express();
  const a: ProxyConfigExt = {
    prefix: '',
    target: 'http://www.baidu.com',
    changeOrigin: true,
    headers: { Connection: 'keep-alive' },
    cookieDomainRewrite: '',
  };
  const proxyMiddleware = createProxyMiddleware<Request, Response>(a);
  app.use('/jimao', proxyMiddleware);
  app.listen(port);
  console.log(`prefixer works on port`, port);
}

prefixer(8821);
