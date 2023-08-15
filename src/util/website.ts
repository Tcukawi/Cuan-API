// modules importing
import express from "express";
import apiRouter from "../routes/api.js";
// import bodyParser from "body-parser";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";

// router and view
app.use(cors());
app.use(bodyParser.json());
app.use("/api/", apiRouter);

// redirect all http request to https
// app.use((req:express.Request, res:express.Response, next:()=> void) => req.secure ? next() : res.redirect(`https://${req.hostname}${req.url}`));
app.get("/", (req, res) => {
  res.send("Ping Pong");
});

export async function start(port:string|number) {
  console.log("==========");
  app.listen(port, () => console.log(`Server started on port ${port}`));
  console.log("==========");
}
