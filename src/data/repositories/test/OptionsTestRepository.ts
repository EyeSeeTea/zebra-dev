import { Future } from "../../../domain/entities/generic/Future";
import { Code, Option } from "../../../domain/entities/Ref";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    //Event Tracker Options
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

    //Risk Grading Options
    getPopulationAtRisks(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Less than 1%", code: "LessThan1" }]);
    }
    getAttackRates(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getGeographicalSpreads(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getLowMediumHighOptions(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getCapacities(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getCapabilities(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
}
