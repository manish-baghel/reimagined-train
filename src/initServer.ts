const express = require("express");
const compression = require("compression");
const cors = require("cors");
import * as http from "http";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as ejs from "ejs";
import * as fs from "fs";
import { env } from "./app";

const environment = env.ENV;
const app = express();

app.use(compression());
app.use(cors());

// view-engine
app.engine('html',ejs.renderFile);
app.set('view engine','html');

// for parsing req body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export {app,express}
