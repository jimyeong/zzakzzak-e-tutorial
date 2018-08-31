require('dotenv').load(); // .env 파일에서 환경변수 불러옵니다.
const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const path = require('path');
const render = require('./ssr').default;
const manifest = require('../../build/asset-manifest.json'); // manifest 파일 안에 CSS 와 JS 파일들의 경로가 들어있음
const app = new Koa();

const port = process.env.PORT || 5000;

// 테스트용 라우터 생성
const router = new Router();
router.get('/api/ping', ctx => {
  ctx.body = {
    message: 'pong',
  };
});

// 라우터를 먼저 적용하고
app.use(router.routes())
app.use(router.allowedMethods());

// 그다음에 정적 파일 제공
const publicPath = path.join(__dirname, '../../build');
app.use(koaStatic(publicPath, { index: false }));

const buildHtml = (html, state) => {
  return `<!doctype html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
    <meta name="theme-color" content="#000000">
    <link rel="manifest" href="/manifest.json">
    <link rel="shortcut icon" href="/favicon.ico">
    <title>React App</title>
    <link href="/${manifest['main.css']}" rel="stylesheet">
  </head>
  
  <body><noscript>You need to enable JavaScript to run this app.</noscript><div id="root">${html}</div>
    <script>
        window.__PRELOADED_STATE__ = ${state ? JSON.stringify(state).replace(/</g, '\\u003c') : 'undefined'}
    </script>
    <script type="text/javascript"
      src="/${manifest['main.js']}"></script>
  </body>
  
  </html>`;
}
// fallback 함수
app.use(async ctx => {
  // 이전 미들웨어에서 처리 할 수 없는 경우에만 이 fallback 이 실행됨
  if (ctx.status !== 404 && !ctx.body) return;
  ctx.status = 200;

  try {
    const result = await render(ctx);
    ctx.body = buildHtml(result.html, result.state);
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log('Server is listening to port ' + port);
})