require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const { external } = require("./constants");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "https://coinhook.xyz",
      "https://timesnap.xyz",
      "https://mercle.xyz",
      "http://timesnap.xyz:3000",
      "http://localhost:3000",
      /\.coinhook\.xyz/,
      /\.timesnap\.xyz/,
      /\.daohook\.xyz/,
      /\.mercle\.xyz/,
    ],
    credentials: true,
    // Allow follow-up middleware to override this CORS for options
    preflightContinue: true,
  })
);


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.send({ time: Date.now() });
});

app.get("/ping", (req, res) => {
  return res.send("pong 5");
});

app.get("/ipfs/:cid", (req, res) => {
  const url = "https://ipfsnode.mercle.xyz";

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
      res.status(500).send("only mercle ipfs supported");
    });
});

app.get("/ipns/:cid", (req, res) => {
  axios({
    method: "get",
    url: external.mercle.ipns(req.params.cid),
    responseType: "stream",
  })
    .then((response) => {
      res.setHeader("Content-Type", response.headers["content-type"]);
      response.data.pipe(res);
    })
    .catch((e) => {
      console.error(e);
      res.status(500).send("only mercle ipfs supported");
    });
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
