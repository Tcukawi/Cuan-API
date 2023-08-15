import mongoose from "mongoose";

export async function connect(url: string) {
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
  console.log("Connected to MongoDB");
  return;
}

