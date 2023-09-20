require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const httpProxy = require("http-proxy");

const app = express();
const apiProxy = httpProxy.createProxyServer({
  target: "http://localhost:5001",
  proxyTimeout: 1000 * 60 * 10,
  timeout: 1000 * 60 * 10,
});
apiProxy.on("error", (err, req, res) => {
  console.log(err);
  res.status(500).send(`Proxy Error\n\n${err}`);
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader == process.env.IPFS_RPC_API) return next();
  return res.status(401).send("Unauthorized");
};

app.get("/", (req, res) => {
  return res.send({ time: Date.now() });
});

app.get("/ping", (req, res) => {
  return res.send("pong");
});

app.use(auth);
app.all("/*", (req, res) => {
  return apiProxy.web(req, res);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).send("404: not found");
});

// error handler
app.use(function (err, req, res, next) {
  res.status(404).send(`not found or error:\n\n${err}`);
});

module.exports = app;
