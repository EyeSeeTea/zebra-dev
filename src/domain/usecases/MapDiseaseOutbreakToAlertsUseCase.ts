import { FutureData } from "../../data/api-futures";
import { AlertRepository } from "../repositories/AlertRepository";
import { Id, Option } from "../entities/Ref";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";

import { Alert } from "../entities/alert/Alert";

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

        const outbreakValue = suspectedDiseaseCode;

        return this.alertRepository
            .updateAlerts({
                eventId: diseaseOutbreakEventId,
                outbreakValue: outbreakValue,
            })
            .flatMap((alerts: Alert[]) =>
                Future.sequential(
                    alerts.map(alert =>
                        this.alertSyncRepository
                            .saveAlertSyncData({
                                alert: alert,
                                nationalDiseaseOutbreakEventId: diseaseOutbreakEventId,
                                outbreakValue: outbreakValue,
                                suspectedDiseases: suspectedDiseases,
                            })
                            .flatMap(() => Future.success(undefined))
                    )
                ).flatMap(() => Future.success(undefined))
            );
    }
}
