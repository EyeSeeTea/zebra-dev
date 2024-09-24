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
