import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Id, NamedRef } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<NamedRef> {
        return apiToFuture(
            this.api.metadata.get({
                options: { fields: { id: true, name: true }, filter: { id: { eq: id } } },
            })
        ).map(response => {
            if (!response.options[0]) throw new Error("Option not found");
            const option: NamedRef = { id: response.options[0].id, name: response.options[0].name };
            return option;
        });
    }
}
