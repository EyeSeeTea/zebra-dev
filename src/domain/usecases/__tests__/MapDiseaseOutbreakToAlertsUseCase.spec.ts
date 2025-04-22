import { getTestCompositionRoot } from "../../../CompositionRoot";

describe("MapDiseaseOutbreakToAlertsUseCase", () => {
    it("does not map disease outbreak to alerts if there is no event id", async () => {
        const compositionRoot = getTestCompositionRoot();

        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
            .execute(
                "",
                {
                    suspectedDiseaseCode: "",
                },
                [{ id: "Biological:Human", name: "Biological:Human" }]
            )
            .run(
                () => fail("Should not reach here"),
                error => expect(error.message).toBe("Disease Outbreak Event Id is required")
            );
    });

    it("maps disease outbreak to alerts", async () => {
        const compositionRoot = getTestCompositionRoot();

        compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
            .execute(
                "123",
                {
                    suspectedDiseaseCode: "",
                },
                [{ id: "Biological:Human", name: "Biological:Human" }]
            )
            .run(
                data => expect(data).toBeUndefined(),
                () => fail("Should not reach here")
            );
    });
});
