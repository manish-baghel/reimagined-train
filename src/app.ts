'use strict';

import {Response, Request, NextFunction, RequestHandler} from 'express';
import env from "./env";
import * as path from "path";
import { app, express } from './initServer';
import * as http from "http";
import * as fs from 'fs';
import * as fse from "fs-extra";
import "./db/initDb";
import httpRoutes from "./routes";

const publicPath = path.join(__dirname, "../public/uploads");
console.log("public path -->", publicPath);
const createdFse = fse.ensureDirSync(publicPath);

const PORT = process.env.PORT || env.PORT || 9001;
console.log(env.SESSION_SECRET)
let environmentRunning: string;

let server: any;
const environment = env.ENV;
switch(environment){
  case 'dev':
    environmentRunning = "development";
    server = http.createServer(app);
  case 'prod':
    environmentRunning= "production";
    server= http.createServer(app);
  case 'default':
    environmentRunning = "development";
    server = http.createServer(app);
}

app.use("/public/uploads", express.static(publicPath));
httpRoutes(app);

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // console.log("==> error  ", err);
  // console.log("==> err.output.payload ", err.output.payload.message);
  const response = { status: false, msg: err.output.payload.message };
  res.status(err.output.statusCode).json(response);
  res.end();
});


server.listen(PORT, function (err: Error) {
  if (err) {
    console.log("=======================================[app.ts]====================================");
    return;
  }
  console.log(`Starting server on port ${PORT} for ${environmentRunning} environment`);
});
