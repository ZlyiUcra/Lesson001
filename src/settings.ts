import dotenv from "dotenv";

dotenv.config()

export const settings = {
  MONGO_URI: process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority",
  JWT_SECRET: process.env.JWT_SECRET || "123",
  PORT: process.env.PORT
}