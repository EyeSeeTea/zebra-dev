import { Future } from "../../../domain/entities/generic/Future";
import { FutureData } from "../../api-futures";

export function assertOrError<T>(objects: T, name: string): FutureData<NonNullable<T>> {
    if (!objects) return Future.error(new Error(`${name} not found`));
    else return Future.success(objects);
}
