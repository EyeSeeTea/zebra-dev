import { useCallback, useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import {
    DataSource,
    DiseaseOutbreakEvent,
} from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import {
    getDateAsMonthYearString,
    getISODateAsLocaleDateString,
} from "../../../data/repositories/utils/DateTimeHelper";

import { User } from "../../components/user-selector/UserSelector";
import { TableRowType } from "../../components/table/BasicTable";
import { RiskAssessmentGrading } from "../../../domain/entities/risk-assessment/RiskAssessmentGrading";
import { mapTeamMemberToUser } from "../form-page/mapEntityToFormState";
import { useExistingEventTrackerTypes } from "../../contexts/existing-event-tracker-types-context";
import { GlobalMessage } from "../form-page/useForm";

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
    notes: string;
};
export function useDiseaseOutbreakEvent(id: Id) {
    const { compositionRoot, configurations } = useAppContext();
    const [formSummary, setFormSummary] = useState<FormSummaryData>();
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [riskAssessmentRows, setRiskAssessmentRows] = useState<TableRowType[]>([]);
    const [eventTrackerDetails, setEventTrackerDetails] = useState<DiseaseOutbreakEvent>();
    const [openCompleteModal, setOpenCompleteModal] = useState(false);
    const { changeExistingEventTrackerTypes, existingEventTrackerTypes } =
        useExistingEventTrackerTypes();

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.get.execute(id, configurations).run(
            diseaseOutbreakEvent => {
                setFormSummary(mapDiseaseOutbreakEventToFormSummary(diseaseOutbreakEvent));
                setRiskAssessmentRows(
                    mapDiseaseOutbreakEventToRiskAssessmentRows(diseaseOutbreakEvent)
                );
                setEventTrackerDetails(diseaseOutbreakEvent);
            },
            err => {
                console.debug(err);
                setGlobalMessage({
                    type: "error",
                    text: `Event tracker with id: ${id} does not exist`,
                });
            }
        );
    }, [compositionRoot.diseaseOutbreakEvent.get, configurations, id]);

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
                    value: diseaseOutbreakEvent.lastUpdated
                        ? diseaseOutbreakEvent.lastUpdated.toString()
                        : "",
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
            notes: diseaseOutbreakEvent.notes || "",
        };
    };

    const mapDiseaseOutbreakEventToRiskAssessmentRows = (
        diseaseOutbreakEvent: DiseaseOutbreakEvent
    ) => {
        if (diseaseOutbreakEvent.riskAssessment) {
            return diseaseOutbreakEvent.riskAssessment.grading.map(riskAssessmentGrading => ({
                riskAssessmentDate: riskAssessmentGrading.lastUpdated
                    ? getISODateAsLocaleDateString(
                          riskAssessmentGrading.lastUpdated.toISOString()
                      ).toDateString()
                    : "",
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

    const orderByRiskAssessmentDate = useCallback(
        (direction: "asc" | "desc") => {
            setRiskAssessmentRows(prevRows => {
                if (direction === "asc") {
                    const sortedRows = prevRows.sort((a, b) => {
                        if (!a.riskAssessmentDate) return -1;
                        if (!b.riskAssessmentDate) return 1;

                        const dateA = new Date(a.riskAssessmentDate).toISOString();
                        const dateB = new Date(b.riskAssessmentDate).toISOString();
                        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
                    });
                    return sortedRows;
                } else {
                    const sortedRows = prevRows.sort((a, b) => {
                        if (!a.riskAssessmentDate) return -1;
                        if (!b.riskAssessmentDate) return -1;

                        const dateA = new Date(a.riskAssessmentDate).toISOString();
                        const dateB = new Date(b.riskAssessmentDate).toISOString();
                        return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
                    });
                    return sortedRows;
                }
            });
        },
        [setRiskAssessmentRows]
    );

    const onCompleteClick = useCallback(() => {
        if (eventTrackerDetails) {
            compositionRoot.diseaseOutbreakEvent.complete
                .execute(eventTrackerDetails, configurations)
                .run(
                    () => {
                        const eventTrackerName =
                            eventTrackerDetails?.hazardType ??
                            eventTrackerDetails?.suspectedDisease?.name;

                        const updatedEventTrackerTypes = existingEventTrackerTypes.filter(
                            eventTrackerType => eventTrackerType !== eventTrackerName
                        );

                        if (eventTrackerName) {
                            changeExistingEventTrackerTypes(updatedEventTrackerTypes);
                        }

                        setGlobalMessage({
                            type: "success",
                            text: `Event tracker with id: ${id} has been completed`,
                        });
                    },
                    err => {
                        console.error(err);
                        setGlobalMessage({
                            type: "error",
                            text: `Failed to complete event: : ${err.message}`,
                        });
                    }
                );
        }
    }, [
        changeExistingEventTrackerTypes,
        compositionRoot.diseaseOutbreakEvent.complete,
        configurations,
        eventTrackerDetails,
        existingEventTrackerTypes,
        id,
    ]);

    const onOpenCompleteModal = useCallback(
        () => setOpenCompleteModal(true),
        [setOpenCompleteModal]
    );
    const onCloseCompleteModal = useCallback(
        () => setOpenCompleteModal(false),
        [setOpenCompleteModal]
    );

    return {
        formSummary,
        globalMessage,
        riskAssessmentRows,
        eventTrackerDetails,
        openCompleteModal,
        onCloseCompleteModal,
        onCompleteClick,
        onOpenCompleteModal,
        orderByRiskAssessmentDate,
    };
}
