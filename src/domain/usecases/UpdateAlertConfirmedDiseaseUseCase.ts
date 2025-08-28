import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Alert } from "../entities/alert/Alert";
import { UNCONFIRMABLE_DISEASE_CODE, UNKNOWN_DISEASE_CODE } from "../entities/alert/OutbreakAlert";
import { Future } from "../entities/generic/Future";
import { Id, Option } from "../entities/Ref";
import { AlertRepository } from "../repositories/AlertRepository";
import { ConfigurationsRepository } from "../repositories/ConfigurationsRepository";
import { DiseaseOutbreakEventRepository } from "../repositories/DiseaseOutbreakEventRepository";

export class UpdateAlertConfirmedDiseaseUseCase {
    constructor(
        private options: {
            alertRepository: AlertRepository;
            diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
            configurationsRepository: ConfigurationsRepository;
        }
    ) {}

    public execute(alertId: Id, newDiseaseName: string): FutureData<void> {
        return this.getDiseaseOptions().flatMap(diseaseOptions => {
            const newDiseaseCode = diseaseOptions.find(
                option => option.name === newDiseaseName
            )?.id;

            if (!newDiseaseCode) {
                return Future.error(new Error(`Invalid disease: ${newDiseaseName}`));
            }

            return this.fetchAndValidateAlert(alertId, newDiseaseCode).flatMap(alert =>
                this.fetchAndValidateMaybeDiseaseOutbreakEventId(alert, newDiseaseCode).flatMap(
                    maybeDiseaseOutbreakId =>
                        this.options.alertRepository.updateConfirmedDiseaseAndChangeMappedEventId(
                            alert.id,
                            newDiseaseCode,
                            maybeDiseaseOutbreakId
                        )
                )
            );
        });
    }

    private fetchAndValidateAlert(alertId: Id, newDiseaseCode: string): FutureData<Alert> {
        return this.options.alertRepository.getById(alertId).flatMap(alert => {
            if (alert.status !== "ACTIVE" || newDiseaseCode === UNKNOWN_DISEASE_CODE) {
                return Future.error(
                    new Error(
                        alert.status !== "ACTIVE"
                            ? "This alert is not active and therefore the confirmed disease cannot be edited."
                            : "Unknown cannot be set as confirmed disease."
                    )
                );
            }
            return Future.success(alert);
        });
    }

    private fetchAndValidateMaybeDiseaseOutbreakEventId(
        alert: Alert,
        newDiseaseCode: string
    ): FutureData<Maybe<Id>> {
        if (
            alert.incidentStatus === "Respond" &&
            newDiseaseCode &&
            newDiseaseCode !== UNKNOWN_DISEASE_CODE &&
            newDiseaseCode !== UNCONFIRMABLE_DISEASE_CODE
        ) {
            return this.options.diseaseOutbreakEventRepository
                .getActiveByDisease(newDiseaseCode)
                .flatMap(maybeDiseaseOutbreakEvent => {
                    if (!maybeDiseaseOutbreakEvent?.id) {
                        console.error(
                            `No active disease outbreak event found for disease ${newDiseaseCode}`
                        );
                        return Future.success(undefined);
                    }
                    return Future.success(maybeDiseaseOutbreakEvent.id);
                });
        }
        return Future.success(undefined);
    }

    private getDiseaseOptions(): FutureData<Option[]> {
        return this.options.configurationsRepository
            .getSelectableOptions()
            .flatMap(selectableOptions => {
                const { suspectedDiseases } = selectableOptions.eventTrackerConfigurations;

                return Future.success(suspectedDiseases);
            });
    }
}
