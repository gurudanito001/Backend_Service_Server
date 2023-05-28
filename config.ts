import dotenv from "dotenv";

// Parsing the env file.
dotenv.config();

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  SERVER_PORT: number | undefined;

  LOCAL_DB_PORT: number | undefined;
  LOCAL_DB_HOST: string | undefined;
  LOCAL_DB_USER: string | undefined;
  LOCAL_DATABASE: string | undefined;
  LOCAL_PASSWORD: string | undefined;
  LOCAL_DATABASE_URL: string | undefined;

  DB_PORT: number | undefined;
  DB_HOST: string | undefined;
  DB_USER: string | undefined;
  DATABASE: string | undefined;
  PASSWORD: string | undefined;
  DATABASE_URL: string | undefined;
  
  ENVIRONMENT: string | undefined;
  SECRET: string | undefined;
  TEST_STRING: string | undefined;
  API_BASE_URL: string | undefined;
  FRONTEND_URL: string | undefined;
}

interface Config {
  SERVER_PORT: number ;
  
  LOCAL_DB_PORT: number;
  LOCAL_DB_HOST: string;
  LOCAL_DB_USER: string;
  LOCAL_DATABASE: string;
  LOCAL_PASSWORD: string;
  LOCAL_DATABASE_URL: string;

  DB_PORT: number;
  DB_HOST: string;
  DB_USER: string;
  DATABASE: string;
  PASSWORD: string;
  DATABASE_URL: string;
  
  ENVIRONMENT: string ;
  SECRET: string;
  TEST_STRING: string;
  API_BASE_URL: string;
  FRONTEND_URL: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    SERVER_PORT: Number(process.env.SERVER_PORT),

    LOCAL_DB_PORT: Number(process.env.LOCAL_DB_PORT),
    LOCAL_DB_HOST: process.env.LOCAL_DB_HOST,
    LOCAL_DB_USER: process.env.LOCAL_DB_USER,
    LOCAL_DATABASE: process.env.LOCAL_DATABASE,
    LOCAL_PASSWORD: process.env.LOCAL_PASSWORD,
    LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL,

    DB_PORT: Number(process.env.DB_PORT),
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DATABASE: process.env.DATABASE,
    PASSWORD: process.env.PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
    
    ENVIRONMENT: process.env.ENVIRONMENT,
    SECRET: process.env.SECRET,
    TEST_STRING: process.env.TEST_STRING,
    API_BASE_URL: process.env.API_BASE_URL,
    FRONTEND_URL: process.env.FRONTEND_URL
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
