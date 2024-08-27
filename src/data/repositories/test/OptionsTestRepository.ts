import { Future } from "../../../domain/entities/generic/Future";
import { Id, Option } from "../../../domain/entities/Ref";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    get(id: Id): FutureData<Option> {
        return Future.success({ id: id, name: "Test Option" });
    }

    getDataSources(): FutureData<Option[]> {
        return Future.success([
            { id: "EBS", name: "EBS", code: "EBS" },
            { id: "IBS", name: "IBS", code: "IBS" },
        ]);
    }

    getHazardTypes(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Hazard Type", code: "HazardTypeCode" }]);
    }

    getMainSyndromes(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Main Syndrome", code: "MainSyndromeCode" }]);
    }

    getSuspectedDiseases(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Test Suspected Disease", code: "SuspectedDiseaseCode" },
        ]);
    }

    getNotificationSources(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Test Notification Source", code: "NotificationSourceCode" },
        ]);
    }

    getIncidentStatus(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Test Incident Status", code: "IncidentStatusCode" },
        ]);
    }
}
