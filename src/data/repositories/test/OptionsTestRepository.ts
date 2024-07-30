import { Future } from "../../../domain/entities/generic/Future";
import { Id, NamedRef } from "../../../domain/entities/Ref";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    get(id: Id): FutureData<NamedRef> {
        return Future.success({ id: id, name: "Test Option" });
    }
}
