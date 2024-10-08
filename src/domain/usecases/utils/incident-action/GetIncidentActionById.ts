import { FutureData } from "../../../../data/api-futures";
import { IncidentResponseActionsDataValues } from "../../../../data/repositories/IncidentActionD2Repository";
import { Maybe } from "../../../../utils/ts-utils";
import _c from "../../../entities/generic/Collection";
import { Future } from "../../../entities/generic/Future";
import { ActionPlan } from "../../../entities/incident-action-plan/ActionPlan";
import { IncidentActionPlan } from "../../../entities/incident-action-plan/IncidentActionPlan";
import {
    ResponseAction,
    Status,
    Verification,
} from "../../../entities/incident-action-plan/ResponseAction";
import { Id } from "../../../entities/Ref";
import { IncidentActionRepository } from "../../../repositories/IncidentActionRepository";
import { OptionsRepository } from "../../../repositories/OptionsRepository";
import { TeamMemberRepository } from "../../../repositories/TeamMemberRepository";

export function getIncidentAction(
    diseaseOutbreakId: Id,
    incidentActionRepository: IncidentActionRepository,
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
): FutureData<Maybe<IncidentActionPlan>> {
    return incidentActionRepository
        .getIncidentActionPlan(diseaseOutbreakId)
        .flatMap(incidentActionPlan => {
            const actionPlan = new ActionPlan({
                id: diseaseOutbreakId,
                iapType: incidentActionPlan?.iapType ?? "",
                phoecLevel: incidentActionPlan?.phoecLevel ?? "",
                criticalInfoRequirements: incidentActionPlan?.criticalInfoRequirements ?? "",
                planningAssumptions: incidentActionPlan?.planningAssumptions ?? "",
                responseObjectives: incidentActionPlan?.responseObjectives ?? "",
                responseStrategies: incidentActionPlan?.responseStrategies ?? "",
                expectedResults: incidentActionPlan?.expectedResults ?? "",
                responseActivitiesNarrative:
                    incidentActionPlan?.responseActivitiesNarrative ?? "" ?? "",
            });

            return incidentActionRepository
                .getIncidentResponseActions(diseaseOutbreakId)
                .flatMap(responseActionDataValues => {
                    return Future.joinObj(
                        getIncidentResponseActionOptionFutures(
                            responseActionDataValues,
                            optionsRepository,
                            teamMemberRepository
                        )
                    ).flatMap(responseActionOptions => {
                        const searchAssignRO = responseActionOptions.searchAssignRO;

                        const responseActions = new ResponseAction({
                            id: diseaseOutbreakId,
                            mainTask: responseActionDataValues?.mainTask ?? "",
                            subActivities: responseActionDataValues?.subActivities ?? "",
                            subPillar: responseActionDataValues?.subPillar ?? "",
                            searchAssignRO: searchAssignRO,
                            dueDate: responseActionDataValues?.dueDate
                                ? new Date(responseActionDataValues.dueDate)
                                : new Date(),
                            timeLine: responseActionDataValues?.timeLine ?? "",
                            status: responseActionOptions.status?.name as Status,
                            verification: responseActionOptions.verification?.name as Verification,
                        });

                        const incidentAction = new IncidentActionPlan({
                            id: diseaseOutbreakId,
                            lastUpdated: new Date(),
                            actionPlan: actionPlan,
                            responseActions: [responseActions],
                        });

                        return Future.success(incidentAction);
                    });
                });
        });
}

function getIncidentResponseActionOptionFutures(
    responseActionsBase: Maybe<IncidentResponseActionsDataValues>,
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
) {
    return {
        searchAssignRO: responseActionsBase?.searchAssignRO
            ? teamMemberRepository.get(responseActionsBase.searchAssignRO)
            : Future.success(undefined),
        status: responseActionsBase?.status
            ? optionsRepository.getStatusOption(responseActionsBase.status)
            : Future.success(undefined),
        verification: responseActionsBase?.verification
            ? optionsRepository.getVerificationOption(responseActionsBase.verification)
            : Future.success(undefined),
    };
}
