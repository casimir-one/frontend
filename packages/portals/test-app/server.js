// eslint-disable-next-line import/no-extraneous-dependencies
const Koa = require('koa');
// eslint-disable-next-line import/no-extraneous-dependencies
const Router = require('koa-router');
// eslint-disable-next-line import/no-extraneous-dependencies
const serve = require('koa-static');

const app = new Koa();
const router = new Router();

const PORT = process.env.PORT || 80;
// const HOST = process.env.HOST || '0.0.0.0';

app.use(serve(`${__dirname}/dist`));
router.get('/env', (ctx) => {
  // eslint-disable-next-line no-param-reassign
  ctx.status = 200;
  // eslint-disable-next-line no-param-reassign,global-require
  ctx.body = require('./config/env.js');
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT);

// eslint-disable-next-line no-console
console.log(`listening on port ${PORT}`);
