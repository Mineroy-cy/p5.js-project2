import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  content: String
});

export default mongoose.model("About", aboutSchema);
