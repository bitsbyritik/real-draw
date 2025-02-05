import express from "express";
const app = express();

import * as dotenv from "dotenv";
import router from "./routes/routes";
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use("/v1", router);

app.listen(PORT, () => {
  console.log(`http server is runing at port: ${PORT}`);
});
