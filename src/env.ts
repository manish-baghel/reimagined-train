import getEnv from './sessionVariable';

// env 
const environment = process.env.ENV || 'prod';
console.log("environment", environment);
if (!environment) {
    console.error("please run application by providing environment");
    throw new Error("environment not found");
}
const env = getEnv(environment);

export default env;
