import { useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { getDateAsLocaleDateTimeString } from "../../../data/repositories/utils/DateTimeHelper";
import { User } from "../../components/user-selector/UserSelector";
import { TableRowType } from "../../components/table/BasicTable";
import {
    getIAPTypeByCode,
    getPhoecLevelByCode,
    getStatusTypeByCode,
    getVerificationTypeByCode,
} from "../../../data/repositories/consts/IncidentActionConstants";

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

export function useIncidentActionPlan(id: Id) {
    const { compositionRoot } = useAppContext();
    const [formSummary, setFormSummary] = useState<FormSummaryData>();
    const [actionPlanSummary, setActionPlanSummary] = useState<FormSummaryData>();
    const [responseActionRows, setResponseActionRows] = useState<TableRowType[]>([]);
    const [summaryError, setSummaryError] = useState<string>();
    const [eventTrackerDetails, setEventTrackerDetails] = useState<DiseaseOutbreakEvent>();

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.get.execute(id).run(
            diseaseOutbreakEvent => {
                setFormSummary(mapIncidentActionToFormSummary(diseaseOutbreakEvent));
                setActionPlanSummary(mapIncidentActionPlanToFormSummary(diseaseOutbreakEvent));
                setResponseActionRows(mapIncidentResponseActionToFormSummary(diseaseOutbreakEvent));
                setEventTrackerDetails(diseaseOutbreakEvent);
            },
            err => {
                console.debug(err);
                setSummaryError(`Event tracker with id: ${id} does not exist`);
            }
        );
    }, [compositionRoot, id]);

    return {
        actionPlanSummary: actionPlanSummary,
        formSummary: formSummary,
        responseActionRows: responseActionRows,
        summaryError: summaryError,
        eventTrackerDetails: eventTrackerDetails,
    };
}

const mapIncidentActionToFormSummary = (
    diseaseOutbreakEvent: DiseaseOutbreakEvent
): FormSummaryData => {
    const { incidentActionPlan, name, lastUpdated } = diseaseOutbreakEvent;

    if (!incidentActionPlan)
        return { subTitle: name, summary: [], incidentManager: undefined, notes: "" };

    const iapTypeCode = incidentActionPlan.actionPlan?.iapType ?? "";
    const phoecLevelCode = incidentActionPlan.actionPlan?.phoecLevel ?? "";

    return {
        subTitle: name,
        summary: [
            {
                label: "IAP last updated",
                value: getDateAsLocaleDateTimeString(lastUpdated),
            },
            {
                label: "IAP type",
                value: getIAPTypeByCode(iapTypeCode) || "",
            },
            {
                label: "PHOEC activation Level",
                value: getPhoecLevelByCode(phoecLevelCode) || "",
            },
        ],
        incidentManager: undefined,
        notes: diseaseOutbreakEvent.notes || "",
    };
};

const mapIncidentActionPlanToFormSummary = (
    diseaseOutbreakEvent: DiseaseOutbreakEvent
): FormSummaryData => {
    const actionPlan = diseaseOutbreakEvent?.incidentActionPlan?.actionPlan;
    if (!actionPlan)
        return { subTitle: "Action Plan", summary: [], incidentManager: undefined, notes: "" };

    return {
        subTitle: "Action Plan",
        summary: [
            {
                label: "Response mode critical information requirements (CIRs)",
                value: actionPlan.criticalInfoRequirements ?? "",
            },
            {
                label: "Planning assumptions",
                value: actionPlan.planningAssumptions ?? "",
            },
            {
                label: "Response objectives (SMART)",
                value: actionPlan.responseObjectives ?? "",
            },
            {
                label: "Sections, functional area operational objectives, expected results",
                value: actionPlan.expectedResults ?? "",
            },
            {
                label: "Response activities narrative",
                value: actionPlan.responseActivitiesNarrative ?? "",
            },
        ],
        incidentManager: undefined,
        notes: diseaseOutbreakEvent.notes || "",
    };
};

const mapIncidentResponseActionToFormSummary = (diseaseOutbreakEvent: DiseaseOutbreakEvent) => {
    if (diseaseOutbreakEvent.incidentActionPlan) {
        return diseaseOutbreakEvent.incidentActionPlan.responseActions.map(responseAction => ({
            mainTask: responseAction.mainTask,
            subActivities: responseAction.subActivities,
            subPillar: responseAction.subPillar,
            searchAssignRO: responseAction.searchAssignRO?.username ?? "",
            status: getStatusTypeByCode(responseAction.status) ?? "",
            verification: getVerificationTypeByCode(responseAction.verification) ?? "",
            timeLine: responseAction.timeLine,
            dueDate: responseAction.dueDate.toISOString(),
        }));
    } else {
        return [];
    }
};
