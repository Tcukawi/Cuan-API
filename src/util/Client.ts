import {connect} from "../db/Mongo.js";

export interface MoreOptions {
  mongoUrl?:string
}

export class Client {
  MongoUrl: string | undefined;
  constructor(uri:string) {
    this.MongoUrl = uri;
  }

  async start() {
    if (this.MongoUrl) {
      await connect(this.MongoUrl);
      return;
    }
    console.log("No URI");
  }
}
