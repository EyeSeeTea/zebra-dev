import { Future } from "../../../domain/entities/generic/Future";
import { Code, Id, Option } from "../../../domain/entities/Ref";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    getMainSyndrome(_optionCode: Code): FutureData<Option> {
        return Future.success({ id: "1", name: "Test Main Syndrome", code: "MainSyndromeCode" });
    }
    getSuspectedDisease(_optionCode: Code): FutureData<Option> {
        return Future.success({ id: "1", name: "Test Disease", code: "DiseaseCode" });
    }
    getNotificationSource(_optionCode: Code): FutureData<Option> {
        return Future.success({
            id: "1",
            name: "Test Notification Source",
            code: "TestNotificationSource",
        });
    }

    getAllDataSources(): FutureData<Option[]> {
        return Future.success([
            { id: "EBS", name: "EBS", code: "EBS" },
            { id: "IBS", name: "IBS", code: "IBS" },
        ]);
    }

    getAllHazardTypes(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Hazard Type", code: "HazardTypeCode" }]);
    }

    getAllMainSyndromes(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Main Syndrome", code: "MainSyndromeCode" }]);
    }

    getAllSuspectedDiseases(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Test Suspected Disease", code: "SuspectedDiseaseCode" },
        ]);
    }

    getAllNotificationSources(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Test Notification Source", code: "NotificationSourceCode" },
        ]);
    }

    getAllIncidentStatus(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Test Incident Status", code: "IncidentStatusCode" },
        ]);
    }
}
