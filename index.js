// this is for read env
require("dotenv").config();
require("isomorphic-fetch");
const koa = require("koa");
const chalk = require("chalk");
const session = require("koa-session");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const send = require("koa-send");
const Router = require("koa-router");
const path = require("path");
const serve = require("koa-static");

//----------------------------------------------------------------------------------

const { connectDb } = require("./server/db/connect");
const installRouter = require("./server/router/install");

//----------------------------------------------------------------------------------

const { PORT: port } = process.env || 80;

//----------------------------------------------------------------------------------

/**
 * create server
 */

const server = new koa();

server.keys = [process.env.SHPIFY_API_SECRET];

server
  .use(session({ sameSite: "none", secure: true }, server))
  .use(installRouter)
  .use(verifyRequest());

server.use(serve(path.join(__dirname, "build")));

// *********** SET OTHER ROUTES HERE *********************

//----------------------------------------------------------------------------------

/**
 * serve build
 */

const router = new Router();

router.get("(.*)", async (ctx, next) => {
  await send(ctx, "/index.html", { root: path.join(__dirname, "/build") });
});

server.use(router.routes());

//----------------------------------------------------------------------------------

connectDb().then((res) => {
  // start the server

  server.listen(port, () => {
    console.log(chalk.blue.inverse(`Server is running on port ${port}`));
  });
});
