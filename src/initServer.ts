import express from "express";
import compression from "compression";
import cors from "cors";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as ejs from "ejs";
import * as fs from "fs";
import multer from "multer";
import env from "./env";

const app = express();
const environment = env.ENV;
const client_url = env.CLIENT_URL;
const client_port = env.CLIENT_PORT;

let whitelist = [`${client_url}`,`${client_url}:${client_port}`];
for(let i=0; i<whitelist.length; i++){
	whitelist[i] = whitelist[i].replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
}

const corsOptions = {
	origin: (origin: any, callback: Function) => {

		if(origin){
			origin = origin.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
		}
		let isOriginInWhitelist = whitelist.indexOf(origin) !== -1;
		if (!origin) {
			isOriginInWhitelist = true;
		} //same origin
                if(environment === "dev" || environment === "development"){
               		return callback(null, true);     
                }
		if (isOriginInWhitelist) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by cors'));
		}
	},
	optionsSuccessStatus: 200,
	credentials: true
};


app.use(compression());
app.use(cors(corsOptions));

// view-engine
app.engine('html',ejs.renderFile);
app.set('view engine','html');

// for parsing req body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const publicPath = path.join(__dirname, "../public/uploads");
console.log("public path for multer", publicPath);
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, publicPath);
	},
	filename: function (req, file, cb) {
		let ext = file.mimetype.split('/')[1];
		if (ext === "svg+xml") {
			ext = "svg";
		}
		cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
	}
});
// Please add filter for image size
export const upload: any = multer({ storage });

export {app,express}
