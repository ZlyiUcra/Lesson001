import {connect, disconnect} from "mongoose";

import {settings} from "../settings";

const dbLink = `${settings.MONGO_URI}/${settings.MONGO_BD_NAME}`;

export async function runDb() {
  try {
    // Connect the client to the server
    await connect(dbLink);
    console.log("Connected successfully to mongo server");

  } catch {
    console.log("Can't connect to db");
    // Ensures that the client will close when you finish/error
    await disconnect();

  }
}
