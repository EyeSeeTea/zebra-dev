import { DataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { Code, Id, Option } from "../../../domain/entities/Ref";
import {
    LowPopulationAtRisk,
    MediumPopulationAtRisk,
    HighPopulationAtRisk,
    LowWeightedOption,
    MediumWeightedOption,
    HighWeightedOption,
    LowGeographicalSpread,
    MediumGeographicalSpread,
    HighGeographicalSpread,
    LowCapacity,
    MediumCapacity,
    HighCapacity,
    Capability1,
    Capability2,
} from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { OptionsRepository } from "../../../domain/repositories/OptionsRepository";
import { FutureData } from "../../api-futures";

export class OptionsTestRepository implements OptionsRepository {
    getLikelihoodOptions(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getLikelihoodOption(_optionCode: Code): FutureData<Option> {
        throw new Error("Method not implemented.");
    }
    getConsequencesOptions(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getConsequencesOption(_optionCode: Code): FutureData<Option> {
        throw new Error("Method not implemented.");
    }
    getLowMediumHighOption(_optionCode: Code): FutureData<Option> {
        throw new Error("Method not implemented.");
    }
    getLowMediumHighOptions(): FutureData<Option[]> {
        throw new Error("Method not implemented.");
    }
    getPopulationAtRisks(): FutureData<
        Array<LowPopulationAtRisk | MediumPopulationAtRisk | HighPopulationAtRisk>
    > {
        throw new Error("Method not implemented.");
    }
    getLowMediumHighWeightedOptions(): FutureData<
        Array<LowWeightedOption | MediumWeightedOption | HighWeightedOption>
    > {
        throw new Error("Method not implemented.");
    }
    getGeographicalSpreads(): FutureData<
        Array<LowGeographicalSpread | MediumGeographicalSpread | HighGeographicalSpread>
    > {
        throw new Error("Method not implemented.");
    }
    getCapacities(): FutureData<Array<LowCapacity | MediumCapacity | HighCapacity>> {
        throw new Error("Method not implemented.");
    }
    getCapabilities(): FutureData<Array<Capability1 | Capability2>> {
        throw new Error("Method not implemented.");
    }
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
}
