import { FutureData } from "../../data/api-futures";
import { AlertRepository } from "../repositories/AlertRepository";
import { Id, Option } from "../entities/Ref";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";
import { Alert } from "../entities/alert/Alert";
import { getOutbreakKey } from "../entities/AlertsAndCaseForCasesData";

type DiseaseOutbreakEventData = Pick<DiseaseOutbreakEventBaseAttrs, "suspectedDiseaseCode">;

export class MapDiseaseOutbreakToAlertsUseCase {
    constructor(
        private alertRepository: AlertRepository,
        private alertSyncRepository: AlertSyncRepository
    ) {}

    public execute(
        diseaseOutbreakEventId: Id,
        diseaseOutbreakEventData: DiseaseOutbreakEventData,
        suspectedDiseases: Option[]
    ): FutureData<void> {
        const { suspectedDiseaseCode } = diseaseOutbreakEventData;

        if (!diseaseOutbreakEventId)
            return Future.error(new Error("Disease Outbreak Event Id is required"));

        const outbreakKey = getOutbreakKey({
            outbreakValue: suspectedDiseaseCode,
            suspectedDiseases: suspectedDiseases,
        });

        return this.alertRepository
            .updateAlerts({
                eventId: diseaseOutbreakEventId,
                outbreakValue: suspectedDiseaseCode,
            })
            .flatMap((alerts: Alert[]) =>
                Future.sequential(
                    alerts.map(alert =>
                        this.alertSyncRepository
                            .saveAlertSyncData({
                                alert: alert,
                                nationalDiseaseOutbreakEventId: diseaseOutbreakEventId,
                                outbreakKey: outbreakKey,
                            })
                            .flatMap(() => Future.success(undefined))
                    )
                ).flatMap(() => Future.success(undefined))
            );
    }
}
