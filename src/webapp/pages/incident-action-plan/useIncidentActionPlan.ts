import { useEffect, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import { getDateAsLocaleDateTimeString } from "../../../data/repositories/utils/DateTimeHelper";
import { TableRowType } from "../../components/table/BasicTable";
import {
    getIAPTypeByCode,
    getPhoecLevelByCode,
    getStatusTypeByCode,
    getVerificationTypeByCode,
} from "../../../data/repositories/consts/IncidentActionConstants";
import { IncidentActionPlan } from "../../../domain/entities/incident-action-plan/IncidentActionPlan";

type LabelWithValue = {
    label: string;
    value: string;
};

export type IncidentActionFormSummaryData = {
    subTitle: string;
    summary: LabelWithValue[];
};

export function useIncidentActionPlan(id: Id) {
    const { compositionRoot } = useAppContext();

    const [incidentAction, setIncidentAction] = useState<LabelWithValue[] | undefined>();
    const [actionPlanSummary, setActionPlanSummary] = useState<IncidentActionFormSummaryData>();
    const [responseActionRows, setResponseActionRows] = useState<TableRowType[]>([]);
    const [globalMessage, setGlobalMessage] = useState<string>();
    const [incidentActionExists, setIncidentActionExists] = useState<boolean>(false);

    useEffect(() => {
        compositionRoot.incidentActionPlan.get.execute(id).run(
            incidentActionPlan => {
                const incidentActionExists = !!incidentActionPlan?.actionPlan?.id;

                setIncidentActionExists(incidentActionExists);
                setIncidentAction(getIncidentActionFormSummary(incidentActionPlan));
                setActionPlanSummary(mapIncidentActionPlanToFormSummary(incidentActionPlan));
                setResponseActionRows(mapIncidentResponseActionToFormSummary(incidentActionPlan));
            },
            err => {
                console.debug(err);
                setGlobalMessage(`Event tracker with id: ${id} does not exist`);
            }
        );
    }, [compositionRoot, id]);

    return {
        incidentActionExists: incidentActionExists,
        actionPlanSummary: actionPlanSummary,
        formSummary: incidentAction,
        responseActionRows: responseActionRows,
        summaryError: globalMessage,
    };
}

const getIncidentActionFormSummary = (
    incidentActionPlan: Maybe<IncidentActionPlan>
): LabelWithValue[] => {
    if (!incidentActionPlan) return [];

    const iapTypeCode = incidentActionPlan.actionPlan?.iapType ?? "";
    const phoecLevelCode = incidentActionPlan.actionPlan?.phoecLevel ?? "";
    const lastUpdated = getDateAsLocaleDateTimeString(new Date()); //TO DO : Fetch sync time from datastore once implemented

    return [
        {
            label: "IAP last updated",
            value: lastUpdated,
        },
        {
            label: "IAP type",
            value: getIAPTypeByCode(iapTypeCode) || "",
        },
        {
            label: "PHOEC activation Level",
            value: getPhoecLevelByCode(phoecLevelCode) || "",
        },
    ];
};

const mapIncidentActionPlanToFormSummary = (
    incidentActionPlan: Maybe<IncidentActionPlan>
): IncidentActionFormSummaryData => {
    const actionPlan = incidentActionPlan?.actionPlan;
    if (!actionPlan) return { subTitle: "Action Plan", summary: [] };

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
    };
};

const mapIncidentResponseActionToFormSummary = (incidentActionPlan: Maybe<IncidentActionPlan>) => {
    if (incidentActionPlan) {
        return incidentActionPlan.responseActions.map(responseAction => ({
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
