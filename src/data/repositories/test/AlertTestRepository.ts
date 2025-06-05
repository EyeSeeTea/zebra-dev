import { Alert } from "../../../domain/entities/alert/Alert";
import { IncidentStatus } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import {
    AlertOptions,
    AlertRepository,
    UpdatePHEOCStatusOptions,
} from "../../../domain/repositories/AlertRepository";
import { FutureData } from "../../api-futures";

export class AlertTestRepository implements AlertRepository {
    updateAlertPHEOCStatus(_options: UpdatePHEOCStatusOptions): FutureData<void> {
        return Future.success(undefined);
    }
    updateActiveVerifiedRespondAlerts(_alertOptions: AlertOptions): FutureData<Alert[]> {
        return Future.success([]);
    }
    getById(alertId: Id): FutureData<Alert> {
        return Future.success({
            id: alertId,
            districtId: "District",
            confirmedDiseaseCode: "DiseaseCode",
            suspectedDiseaseCode: "SuspectedDiseaseCode",
        });
    }
    updateAlertsPHEOCStatusByDiseaseOutbreakId(
        _diseaseOutbreakId: Id,
        _pheocStatus: IncidentStatus
    ): FutureData<void> {
        return Future.success(undefined);
    }
    updateConfirmedDisease(_alertId: Id, _diseaseName: string): FutureData<void> {
        return Future.success(undefined);
    }
}
