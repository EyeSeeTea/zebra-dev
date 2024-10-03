import { getTestCompositionRoot } from "../../../CompositionRoot";
import {
    DataSource,
    NationalIncidentStatus,
} from "../../entities/disease-outbreak-event/DiseaseOutbreakEvent";

describe("MapDiseaseOutbreakToAlertsUseCase", () => {
    it("does not map disease outbreak to alerts if there is no event id", async () => {
        const compositionRoot = getTestCompositionRoot();

        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
            .execute("", {
                dataSource: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
                hazardType: "Biological:Human",
                suspectedDiseaseCode: "",
                incidentStatus: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH,
            })
            .run(
                () => fail("Should not reach here"),
                error => expect(error.message).toBe("Disease Outbreak Event Id is required")
            );
    });

    it("maps disease outbreak to alerts", async () => {
        const compositionRoot = getTestCompositionRoot();

        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
            .execute("123", {
                dataSource: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
                hazardType: "Biological:Human",
                suspectedDiseaseCode: "",
                incidentStatus: NationalIncidentStatus.RTSL_ZEB_OS_INCIDENT_STATUS_WATCH,
            })
            .run(
                data => expect(data).toBeUndefined(),
                () => fail("Should not reach here")
            );
    });
});
