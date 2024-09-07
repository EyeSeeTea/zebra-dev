import { useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import {
    DataSource,
    DiseaseOutbreakEvent,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    getDateAsLocaleDateTimeString,
    getDateAsMonthYearString,
} from "../../../data/repositories/utils/DateTimeHelper";

import { User } from "../../components/user-selector/UserSelector";
import { TableRowType } from "../../components/table/BasicTable";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { mapTeamMemberToUser } from "../form-page/mapEntityToFormState";

const EventTypeLabel = "Event type";
const DiseaseLabel = "Disease";
type LabelWithValue = {
    label: string;
    value: string;
};

export type FormSummaryData = {
    subTitle: string;
    summary: LabelWithValue[];
    incidentManager: Maybe<User>;
};
export function useDiseaseOutbreakEvent(id: Id) {
    const { compositionRoot } = useAppContext();
    const [formSummary, setFormSummary] = useState<FormSummaryData>();
    const [summaryError, setSummaryError] = useState<string>();
    const [riskAssessmentRows, setRiskAssessmentRows] = useState<TableRowType[]>([]);

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.get.execute(id).run(
            diseaseOutbreakEvent => {
                setFormSummary(mapDiseaseOutbreakEventToFormSummary(diseaseOutbreakEvent));
                setRiskAssessmentRows(
                    mapDiseaseOutbreakEventToRiskAssessmentRows(diseaseOutbreakEvent)
                );
            },
            err => {
                console.debug(err);
                setSummaryError(`Event tracker with id: ${id} does not exist`);
            }
        );
    }, [compositionRoot.diseaseOutbreakEvent.get, id]);

    const mapDiseaseOutbreakEventToFormSummary = (
        diseaseOutbreakEvent: DiseaseOutbreakEvent
    ): FormSummaryData => {
        const dataSourceLabelValue: LabelWithValue =
            diseaseOutbreakEvent.dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS
                ? {
                      label: EventTypeLabel,
                      value: diseaseOutbreakEvent.hazardType ?? "",
                  }
                : {
                      label: DiseaseLabel,
                      value: diseaseOutbreakEvent.suspectedDisease?.name ?? "",
                  };
        return {
            subTitle: diseaseOutbreakEvent.name,
            summary: [
                {
                    label: "Last updated",
                    value: getDateAsLocaleDateTimeString(diseaseOutbreakEvent.lastUpdated),
                },
                dataSourceLabelValue,
                {
                    label: "Event ID",
                    value: diseaseOutbreakEvent.id,
                },
                {
                    label: "Emergence date",
                    value: getDateAsMonthYearString(diseaseOutbreakEvent.emerged.date),
                },
                {
                    label: "Detection date",
                    value: getDateAsMonthYearString(diseaseOutbreakEvent.detected.date),
                },
                {
                    label: "Notification date",
                    value: getDateAsMonthYearString(diseaseOutbreakEvent.notified.date),
                },
            ],
            incidentManager: diseaseOutbreakEvent.incidentManager
                ? mapTeamMemberToUser(diseaseOutbreakEvent.incidentManager)
                : undefined,
        };
    };

    const mapDiseaseOutbreakEventToRiskAssessmentRows = (
        diseaseOutbreakEvent: DiseaseOutbreakEvent
    ) => {
        if (diseaseOutbreakEvent.riskAssessment) {
            return diseaseOutbreakEvent.riskAssessment.grading.map(riskAssessmentGrading => ({
                grade: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.getGrade().getOrThrow()
                ),
                populationRisk: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.populationAtRisk.type
                ),
                attackRate: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.attackRate.type
                ),
                geographical: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.geographicalSpread.type
                ),
                complexity: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.complexity.type
                ),
                capacity: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.capacity.type
                ),
                capability: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.capacity.type
                ),
                reputationRisk: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.reputationalRisk.type
                ),
                severity: RiskAssessmentGrading.getTranslatedLabel(
                    riskAssessmentGrading.severity.type
                ),
            }));
        } else {
            return [];
        }
    };

    return { formSummary, summaryError, riskAssessmentRows };
}
