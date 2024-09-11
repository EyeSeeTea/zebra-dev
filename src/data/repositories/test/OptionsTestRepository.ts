import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { Code, Id, Option } from "../../../domain/entities/Ref";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    get(id: Id): FutureData<Option> {
        return Future.success({ id: id, name: "Test Main Syndrome", code: "MainSyndromeCode" });
    }
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

    getDataSources(): FutureData<Option[]> {
        return Future.success([
            { id: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS, name: "EBS" },
            { id: DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS, name: "IBS" },
        ]);
    }

    getHazardTypes(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Hazard Type" }]);
    }

    getHazardTypesByCode(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Hazard Type" }]);
    }

    getMainSyndromes(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Main Syndrome" }]);
    }

    getSuspectedDiseases(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Suspected Disease" }]);
    }

    getNotificationSources(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Notification Source" }]);
    }

    getIncidentStatus(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Test Incident Status" }]);
    }
}
