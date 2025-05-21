import { Alert } from "../../../domain/entities/alert/Alert";
import { IncidentStatus } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { AlertOptions, AlertRepository } from "../../../domain/repositories/AlertRepository";
import { FutureData } from "../../api-futures";

export class AlertTestRepository implements AlertRepository {
    updateAlertPHEOCStatus(
        _alertId: Id,
        _orgUnit: string,
        _status: IncidentStatus
    ): FutureData<void> {
        return Future.success(undefined);
    }
    getIncidentStatusByAlert(_alertId: Id): FutureData<IncidentStatus> {
        return Future.success("Alert");
    }
    updateAlerts(_alertOptions: AlertOptions): FutureData<Alert[]> {
        return Future.success([]);
    }
    updateMappedDiseaseOutbreakEventIdByPHEOCStatus(
        _alertId: Id,
        _diseaseOutbreakId: Id,
        _status: IncidentStatus
    ): FutureData<void> {
        return Future.success(undefined);
    }

    getAlertById(alertId: Id): FutureData<Alert> {
        return Future.success({
            id: alertId,
            district: "District",
            disease: "Disease",
        });
    }

    updateAlertsPHEOCStatusByDiseaseOutbreakId(
        _diseaseOutbreakId: Id,
        _pheocStatus: IncidentStatus
    ): FutureData<void> {
        return Future.success(undefined);
    }
}
