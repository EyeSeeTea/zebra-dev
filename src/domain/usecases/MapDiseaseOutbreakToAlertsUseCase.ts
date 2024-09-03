import { FutureData } from "../../data/api-futures";
import { AlertRepository } from "../repositories/AlertRepository";
import _ from "../entities/generic/Collection";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import { hazardTypeCodeMap } from "../../data/repositories/consts/DiseaseOutbreakConstants";
import { AlertSyncRepository } from "../repositories/AlertSyncRepository";

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
        diseaseOutbreakEventData: DiseaseOutbreakEventData
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
            .flatMap(response =>
                Future.sequential(
                    response.map(alert => {
                        return this.alertSyncRepository.saveAlertSyncData({
                            alertData: alert,
                            eventId: diseaseOutbreakEventId,
                            dataSource: dataSource,
                            hazardTypeCode: hazardTypeCode,
                            suspectedDiseaseCode: suspectedDiseaseCode,
                        });
                    })
                ).flatMap(() => {
                    return Future.success(undefined);
                })
            );
    }
}
