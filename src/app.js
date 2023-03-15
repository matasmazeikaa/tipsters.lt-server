const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const Paysera = require("paysera-nodejs");

require("dotenv").config();

const middlewares = require("./middlewares");
const api = require("./api");

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

function guidGenerator() {
  return 100000 + Math.floor(Math.random() * 900000);
}

console.log(process.env.PAYSERA_PROJECT_ID);

const paysera = new Paysera({
  projectid: process.env.PAYSERA_PROJECT_ID,
  sign_password: process.env.PAYSERA_PASSWORD,
  accepturl: "https://tipsters.lt/mokejimas-pavyko",
  cancelurl: "https://tipsters.lt/mokejimas-nepavyko",
  callbackurl: "http://45.9.190.55/tipsters/ok",
  test: 1,
});

app.post("/tipsters/pay", (req, res) => {
  const { amount } = req.body;

  res.json({
    redirectUrl: paysera.buildRequestUrl({
      orderid: guidGenerator(),
      amount: Number(amount),
      currency: "EUR",
    }),
  });
});

app.get("/tipsters/ok", (req, res) => {
  res.json("OK");
});

app.use("/tipsters", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
