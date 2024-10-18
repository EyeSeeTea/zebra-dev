import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Instance } from "../data/entities/Instance";

type Auth = {
    username: string;
    password: string;
};

type D2ApiArgs = {
    url: string;
    auth?: Auth;
};

export function getD2ApiFromArgs(args: D2ApiArgs): D2Api {
    const { url, auth } = args;

    return new D2Api({ baseUrl: url, auth });
}

export function getInstance(args: D2ApiArgs): Instance {
    const instance = new Instance({ url: args.url, ...args.auth });
    return instance;
}

export function getApiInstanceFromEnvVariables() {
    if (!process.env.VITE_DHIS2_BASE_URL)
        throw new Error("VITE_DHIS2_BASE_URL must be set in the .env file");

    if (!process.env.VITE_DHIS2_AUTH)
        throw new Error("VITE_DHIS2_AUTH must be set in the .env file");

    const username = process.env.VITE_DHIS2_AUTH.split(":")[0] ?? "";
    const password = process.env.VITE_DHIS2_AUTH.split(":")[1] ?? "";

    if (username === "" || password === "") {
        throw new Error("VITE_DHIS2_AUTH must be in the format 'username:password'");
    }

    const envVars = {
        url: process.env.VITE_DHIS2_BASE_URL,
        auth: {
            username: username,
            password: password,
        },
    };

    const api = getD2ApiFromArgs(envVars);
    const instance = getInstance(envVars);

    return { api: api, instance: instance };
}
