import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { createProxyMiddleware, responseInterceptor } from 'http-proxy-middleware';
import type { Filter, Options, RequestHandler } from 'http-proxy-middleware';
import { JSDOM } from 'jsdom';

type ProxyConfig = Parameters<typeof createProxyMiddleware<Request, Response>>[0];
export
interface ProxyConfigExt extends ProxyConfig {
  prefix: string;
}

function prefixer(port: number, configs: ProxyConfigExt[]) {
  const app = express();
  configs.forEach((config) => {
    const proxyMiddleware = createProxyMiddleware<Request, Response>({
      changeOrigin: true,
      headers: { Connection: 'keep-alive' },
      cookieDomainRewrite: '',
      selfHandleResponse: true,
      ...config,
    });
    console.log('prefixer', `http://127.0.0.1:${port}${config.prefix}`, '->', config.target);
    app.use(config.prefix, proxyMiddleware);
  });
  app.listen(port);
  console.log(`prefixer works on port`, port);
}

prefixer(8821, [
  {
    prefix: '/jimao/huoshenshan',
    target: 'http://xfiregod.perfma-inc.com',
    on: {
      proxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type']?.toLowerCase() ?? '';
        if (contentType.startsWith('text/html')) {
          const html = responseBuffer.toString('utf8');
          const htmlDOM = new JSDOM(html);
          htmlDOM.window.document.querySelectorAll('script, img, iframe').forEach((item: any) => {
            item.src = '/jimao/huoshenshan' + item.src;
          });
          htmlDOM.window.document.querySelectorAll('link').forEach((item) => {
            item.href = '/jimao/huoshenshan' + item.href;
          });
          return htmlDOM.serialize();
        }
        return responseBuffer;
      }),
    },
  },
]);
