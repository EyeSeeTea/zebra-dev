import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { Code, Id, Option } from "../../../domain/entities/Ref";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    //Event Tracker Options
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
