import { FutureData } from "../../data/api-futures";
import { AlertRepository } from "../repositories/AlertRepository";
import _ from "../entities/generic/Collection";
import { Id } from "../entities/Ref";
import { DiseaseOutbreakEventBaseAttrs } from "../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../entities/generic/Future";
import {
    hazardTypeCodeMap,
    RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID,
} from "../../data/repositories/consts/DiseaseOutbreakConstants";

const incidentDataSourceCode = "IBS";

export class MapDiseaseOutbreakToAlertsUseCase {
    constructor(private alertRepository: AlertRepository) {}

    public execute(
        diseaseOutbreakEventId: Id,
        diseaseOutbreakEventData: DiseaseOutbreakEventBaseAttrs
    ): FutureData<void> {
        const { dataSourceCode, hazardType, suspectedDiseaseCode } = diseaseOutbreakEventData;
        const hazardTypeCode = hazardTypeCodeMap[hazardType];

        if (!diseaseOutbreakEventId)
            return Future.error(new Error("Disease Outbreak Event Id is required"));

        const filter =
            dataSourceCode === incidentDataSourceCode
                ? { id: RTSL_ZEBRA_ALERTS_DISEASE_TEA_ID, value: suspectedDiseaseCode }
                : { id: RTSL_ZEBRA_ALERTS_EVENT_TYPE_TEA_ID, value: hazardTypeCode };

        return this.alertRepository.updateEventIdInAlerts({
            eventId: diseaseOutbreakEventId,
            filter: filter,
        });
    }
}
