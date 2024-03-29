import dotenv from "dotenv";

dotenv.config()

export const settings = {
  MONGO_URI: process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority",
  MONGO_BD_NAME: process.env.MONGODB_NAME || "instagram",
  JWT_SECRET: process.env.JWT_SECRET || "123",
  PORT: process.env.PORT,
  ATTEMPTS_TOKEN_LIMIT: process.env.ATTEMPTS_TOKEN_LIMIT || 5,
  TIME_LIMIT: process.env.TIME_LIMIT || 10,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,
  EMAIL: process.env.EMAIL,
  EMAIL_AUTH: process.env.EMAIL_AUTH
}