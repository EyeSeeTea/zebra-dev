import { FutureData } from "../../data/api-futures";
import { AlertRepository } from "../repositories/AlertRepository";
import _ from "../entities/generic/Collection";
import { Id, Option } from "../entities/Ref";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { hazardTypeCodeMap } from "../../data/repositories/consts/DiseaseOutbreakConstants";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";

import { Alert } from "../entities/alert/Alert";

type DiseaseOutbreakEventData = Pick<
    DiseaseOutbreakEventBaseAttrs,
    "dataSource" | "hazardType" | "incidentStatus" | "suspectedDiseaseCode"
>;

export class MapDiseaseOutbreakToAlertsUseCase {
    constructor(
        private alertRepository: AlertRepository,
        private alertSyncRepository: AlertSyncRepository
    ) {}

    public execute(
        diseaseOutbreakEventId: Id,
        diseaseOutbreakEventData: DiseaseOutbreakEventData,
        hazardTypes: Option[],
        suspectedDiseases: Option[]
    ): FutureData<void> {
        const { dataSource, hazardType, incidentStatus, suspectedDiseaseCode } =
            diseaseOutbreakEventData;

        const hazardTypeCode = hazardType ? hazardTypeCodeMap[hazardType] : undefined;

        if (!diseaseOutbreakEventId)
            return Future.error(new Error("Disease Outbreak Event Id is required"));

        return this.alertRepository
            .updateAlerts({
                dataSource: dataSource,
                eventId: diseaseOutbreakEventId,
                hazardTypeCode: hazardTypeCode,
                incidentStatus: incidentStatus,
                suspectedDiseaseCode: suspectedDiseaseCode,
            })
            .flatMap((alerts: Alert[]) =>
                Future.sequential(
                    alerts.map(alert =>
                        this.alertSyncRepository
                            .saveAlertSyncData({
                                alert: alert,
                                nationalDiseaseOutbreakEventId: diseaseOutbreakEventId,
                                dataSource: dataSource,
                                hazardTypeCode: hazardTypeCode,
                                suspectedDiseaseCode: suspectedDiseaseCode,
                                hazardTypes: hazardTypes,
                                suspectedDiseases: suspectedDiseases,
                            })
                            .flatMap(() => Future.success(undefined))
                    )
                ).flatMap(() => Future.success(undefined))
            );
    }
}
