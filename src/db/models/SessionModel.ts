import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    loggedInAt: {type:Date},
    loggedOutAt: {type:Date},
    user: {type: Schema.Types.ObjectId, ref:"User"}
  }
);

const Session = mongoose.model('Session',sessionSchema);

export default Session;
