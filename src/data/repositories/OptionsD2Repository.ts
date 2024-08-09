import { D2Api } from "../../types/d2-api";
import { Code, Option } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { assertOrError } from "./utils/AssertOrError";

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    get(code: Code): FutureData<Option> {
        return apiToFuture(
            this.api.metadata.get({
                options: { fields: { code: true, name: true }, filter: { code: { eq: code } } },
            })
        )
            .flatMap(response => assertOrError(response.options[0], "Option"))
            .map(d2Option => {
                const option: Option = {
                    id: d2Option.code,
                    name: d2Option.name,
                };
                return option;
            });
    }
}
