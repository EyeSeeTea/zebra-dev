import { getTestCompositionRoot } from "../../../CompositionRoot";

describe("MapDiseaseOutbreakToAlertsUseCase", () => {
    it("does not map disease outbreak to alerts if there is no event id", async () => {
        const compositionRoot = getTestCompositionRoot();

        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
            .execute("", {
                dataSource: "EBS",
                hazardType: "Biological:Human",
                suspectedDiseaseCode: "",
                incidentStatus: "Watch",
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
                dataSource: "EBS",
                hazardType: "Biological:Human",
                suspectedDiseaseCode: "",
                incidentStatus: "Watch",
            })
            .run(
                data => expect(data).toBeUndefined(),
                () => fail("Should not reach here")
            );
    });
});
