import yenv from "yenv";
const getEnv = (environment:string)=>{
    const sessionVariables:any = yenv("settings.yaml", { env: environment});

    return sessionVariables;

}

export default getEnv;
