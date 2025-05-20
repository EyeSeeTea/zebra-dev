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
                suspectedDiseases
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
                    suspectedDiseaseCode: "RTSL_ZEB_OS_DISEASE_CHOLERA",
                },
                suspectedDiseases
            )
            .run(
                data => expect(data).toBeUndefined(),
                () => fail("Should not reach here")
            );
    });
});

const suspectedDiseases = [
    { id: "RTSL_ZEB_OS_DISEASE_ANTHRAX", name: "Anthrax" },
    { id: "RTSL_ZEB_OS_DISEASE_CHOLERA", name: "Cholera" },
];
