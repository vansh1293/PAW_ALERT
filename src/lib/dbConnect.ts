import mongoose from "mongoose";

type ConnectOptions = {
  isConnected?: number;
};  

const connection : ConnectOptions = {};

async function connectdb():Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing database connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI as string);
    connection.isConnected = db.connections[0].readyState;
    console.log("New database connection established");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); //gracefully exit the process
  } 
}

export default connectdb;
