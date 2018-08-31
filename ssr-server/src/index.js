require('dotenv').load(); // .env 파일에서 환경변수 불러옵니다.
const Koa = require('koa');
const Router = require('koa-router');
const koaStatic = require('koa-static');
const path = require('path');
// const fs = require('fs'); // 파일을 읽어오는 모듈
const render = require('./ssr').default;
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

// const indexPath = path.join(publicPath, 'index.html');
// const indexHtml = fs.readFileSync(indexPath);

// fallback 함수
app.use(async ctx => {
  // 이전 미들웨어에서 처리 할 수 없는 경우에만 이 fallback 이 실행됨
  if (ctx.status !== 404 && !ctx.body) return;
  ctx.status = 200;

  try {
    const result = await render(ctx);
    ctx.body = result;
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log('Server is listening to port ' + port);
})