import dotenv from "dotenv";

// Parsing the env file.
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  SERVER_PORT: number | undefined;
  DB_PORT: number | undefined;
  DB_HOST: string | undefined;
  DB_USER: string | undefined;
  DATABASE: string | undefined;
  PASSWORD: string | undefined;
  DATABASE_URL: string | undefined;
  ENVIRONMENT: string | undefined;
}

interface Config {
  SERVER_PORT: number ;
  DB_PORT: number ;
  DB_HOST: string ;
  DB_USER: string ;
  DATABASE: string ;
  PASSWORD: string ;
  DATABASE_URL: string ;
  ENVIRONMENT: string ;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  console.log(process.env.DB_USER)
  return {
    SERVER_PORT: Number(process.env.PORT),
    DB_PORT: Number(process.env.DB_PORT),
    DB_HOST: process.env.DB_HOST ,
    DB_USER: process.env.DB_USER,
    DATABASE: process.env.DATABASE,
    PASSWORD: process.env.PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
  };
};

// Throwing an Error if any field was undefined we don't 
// want our app to run if it can't connect to DB and ensure 
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type 
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
