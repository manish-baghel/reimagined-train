import mongoose from "mongoose";
import {env } from "../app";

const DB_URL = `${env.DB_URL}:${env.DB_PORT}/${env.DB_NAME}`;
mongoose.connect(DB_URL);

const db = mongoose.connection;

db.on('error', console.error.bind(console,'==> connection error: '));
db.once('open', () => {
  console.log(`--> We are connected to db at: ${DB_URL}`);
});

export default db;
