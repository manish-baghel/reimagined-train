import * as yenv from "yenv";
const getEnv = (environment:string)=>{
    const sessionVariables = yenv("settings.yaml", { env: environment});

    return sessionVariables;

}

export default getEnv;
