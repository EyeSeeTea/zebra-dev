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

    getGeographicalSpreads(): FutureData<Option[]> {
        return Future.success([{ id: "1", name: "Within a district", code: "WithinDistrict" }]);
    }
    getLowMediumHighOptions(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Low", code: "Low" },
            { id: "2", name: "Medium", code: "Medium" },
        ]);
    }
    getCapacities(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Within District", code: "WD" },
            { id: "2", name: "Within Province", code: "WP" },
        ]);
    }
    getCapabilities(): FutureData<Option[]> {
        return Future.success([
            { id: "1", name: "Cap1", code: "Cap1" },
            { id: "2", name: "Cap2", code: "Cap2" },
        ]);
    }
}
