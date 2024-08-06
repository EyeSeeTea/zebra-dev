import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Code, NamedRef } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { Future } from "../../domain/entities/generic/Future";

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    get(code: Code): FutureData<NamedRef> {
        if (!code) return Future.success({ id: "", name: "" });
        return apiToFuture(
            this.api.metadata.get({
                options: { fields: { code: true, name: true }, filter: { code: { eq: code } } },
            })
        ).map(response => {
            if (!response.options[0]) throw new Error("Option not found");
            const option: NamedRef = {
                id: response.options[0].code,
                name: response.options[0].name,
            };
            return option;
        });
    }
}
