import { Future } from "../../../domain/entities/generic/Future";
import { FutureData } from "../../api-futures";

export function assertOrError<T>(obj: T, name: string): FutureData<NonNullable<T>> {
    if (!obj) return Future.error(new Error(`${name} not found`));
    else return Future.success(obj);
}
