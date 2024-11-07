import { useCallback, useEffect, useMemo, useState } from "react";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";
import { useAppContext } from "../../contexts/app-context";
import { getDateAsLocaleDateTimeString } from "../../../data/repositories/utils/DateTimeHelper";
import { TableColumn, TableRowType } from "../../components/table/BasicTable";
import {
    getIAPTypeByCode,
    getPhoecLevelByCode,
    getStatusTypeByCode,
    getVerificationTypeByCode,
} from "../../../data/repositories/consts/IncidentActionConstants";
import {
    IncidentActionOptions,
    IncidentActionPlan,
} from "../../../domain/entities/incident-action-plan/IncidentActionPlan";
import { Option } from "../../components/utils/option";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { DiseaseOutbreakEvent } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";

export type IncidentActionFormSummaryData = {
    subTitle: string;
    summary: Option[];
};

export type UIIncidentActionOptions = {
    status: Option[];
    verification: Option[];
};

export function useIncidentActionPlan(id: Id) {
    const { compositionRoot, configurations: appConfiguration } = useAppContext();
    const { changeCurrentEventTracker, getCurrentEventTracker } = useCurrentEventTracker();

    const [incidentAction, setIncidentAction] = useState<Option[] | undefined>();
    const [actionPlanSummary, setActionPlanSummary] = useState<IncidentActionFormSummaryData>();
    const [responseActionRows, setResponseActionRows] = useState<TableRowType[]>([]);
    const [globalMessage, setGlobalMessage] = useState<string>();
    const [incidentActionExists, setIncidentActionExists] = useState<boolean>(false);
    const [incidentActionOptions, setIncidentActionOptions] = useState<UIIncidentActionOptions>();

    const saveTableOption = useCallback(
        (value: Maybe<string>, rowIndex: number, column: TableColumn["value"]) => {
            const eventId = responseActionRows[rowIndex]?.id ?? "";
            compositionRoot.incidentActionPlan.updateResponseAction
                .execute({
                    diseaseOutbreakId: id,
                    eventId: eventId,
                    responseAction: { value: value ?? "", type: column },
                })
                .run(
                    () => console.debug(`${column} table option saved successfully`),
                    err => setGlobalMessage(`Error saving table option: ${err}`)
                );
        },
        [compositionRoot, id, responseActionRows]
    );

    const responseActionColumns: TableColumn[] = useMemo(() => {
        return [
            { value: "mainTask", label: "Main task", type: "text" },
            { value: "subActivities", label: "Sub Activities", type: "text" },
            { value: "subPillar", label: "Sub Pillar", type: "text" },
            {
                value: "searchAssignRO",
                label: "Responsible officer",
                type: "text",
            },
            {
                value: "status",
                label: "Status",
                type: "selector",
                options: incidentActionOptions?.status ?? [],
                onChange: saveTableOption,
            },
            {
                value: "verification",
                label: "Verification",
                type: "selector",
                options: incidentActionOptions?.verification ?? [],
                onChange: saveTableOption,
            },
            { value: "timeLine", label: "Timeline", type: "text" },
            { value: "dueDate", label: "Due date", type: "text" },
        ];
    }, [incidentActionOptions, saveTableOption]);

    useEffect(() => {
        compositionRoot.incidentActionPlan.get.execute(id, appConfiguration).run(
            incidentActionPlan => {
                const incidentActionExists = !!incidentActionPlan?.actionPlan?.id;
                const incidentActionOptions = incidentActionPlan?.incidentActionOptions;
                const currentEventTracker = getCurrentEventTracker();
                if (incidentActionExists && currentEventTracker) {
                    const updatedEventTracker = new DiseaseOutbreakEvent({
                        ...currentEventTracker,
                        incidentActionPlan: incidentActionPlan,
                    });

                    changeCurrentEventTracker(updatedEventTracker);
                }
                setIncidentActionExists(incidentActionExists);
                setIncidentActionOptions(mapIncidentActionOptionsToTable(incidentActionOptions));
                setIncidentAction(getIncidentActionFormSummary(incidentActionPlan));
                setActionPlanSummary(mapIncidentActionPlanToFormSummary(incidentActionPlan));
                setResponseActionRows(mapIncidentResponseActionToTableRows(incidentActionPlan));
            },
            err => {
                console.debug(err);
                setGlobalMessage(`Event tracker with id: ${id} does not exist`);
            }
        );
    }, [compositionRoot, id, changeCurrentEventTracker, getCurrentEventTracker, appConfiguration]);

    return {
        incidentActionExists: incidentActionExists,
        saveTableOption: saveTableOption,
        responseActionColumns: responseActionColumns,
        actionPlanSummary: actionPlanSummary,
        formSummary: incidentAction,
        responseActionRows: responseActionRows,
        summaryError: globalMessage,
    };
}

const getIncidentActionFormSummary = (incidentActionPlan: Maybe<IncidentActionPlan>): Option[] => {
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

const mapIncidentResponseActionToTableRows = (
    incidentActionPlan: Maybe<IncidentActionPlan>
): TableRowType[] => {
    if (incidentActionPlan) {
        return incidentActionPlan.responseActions.map(responseAction => ({
            id: responseAction.id,
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

const mapIncidentActionOptionsToTable = (
    incidentActionOptions: Maybe<IncidentActionOptions>
): UIIncidentActionOptions => {
    return {
        status:
            incidentActionOptions?.status.map(option => ({
                value: getStatusTypeByCode(option.id) ?? "",
                label: option.name,
            })) ?? [],

        verification:
            incidentActionOptions?.verification.map(option => ({
                value: getVerificationTypeByCode(option.id) ?? "",
                label: option.name,
            })) ?? [],
    };
};
