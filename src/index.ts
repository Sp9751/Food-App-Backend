import express from "express";
import App from "./services/ExpressApp";
import DataBase from "./services/DataBase";
import { PORT } from "./conig";

const StartServer = async () => {
  const app = express();

  await DataBase();

  await App(app);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

StartServer();
