import { D2Api, DataStore } from "@eyeseetea/d2-api/2.36";
import { apiToFuture, FutureData } from "./api-futures";

export const dataStoreNamespace = "zebra";

export class DataStoreClient {
    private dataStore: DataStore;

    constructor(private api: D2Api) {
        this.dataStore = this.api.dataStore(dataStoreNamespace);
    }

    public listCollection<T>(key: string): FutureData<T[]> {
        return apiToFuture(this.dataStore.get<T[]>(key)).map(data => data ?? []);
    }

    public getObject<T extends object>(key: string): FutureData<T | undefined> {
        return apiToFuture(this.dataStore.get<T>(key));
    }

    public saveObject<T extends object>(key: string, value: T): FutureData<void> {
        return apiToFuture(this.dataStore.save(key, value));
    }

    public removeObject(key: string): FutureData<boolean> {
        return apiToFuture(this.dataStore.delete(key));
    }
}
