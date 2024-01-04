require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const { external } = require("./constants");
const axios = require("axios");

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.send({ time: Date.now() });
});

app.get("/ping", (req, res) => {
  return res.send("pong");
});

app.get("/ipfs/:cid", (req, res) => {
  const url = "https://lbIpfsGateway-740070732.us-east-1.elb.amazonaws.com";

  axios({
    method: "get",
    url: `${url}/ipfs/${req.params.cid}`,
    responseType: "stream",
  })
    .then((response) => {
      res.setHeader("Content-Type", response.headers["content-type"]);
      response.data.pipe(res);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("Error occurred while fetching data");
    });
});

app.get("/ipns/:cid", (req, res) => {
  // if ipns, get data from db
  return res.redirect(external.mercle.ipns(req.params.cid));
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
