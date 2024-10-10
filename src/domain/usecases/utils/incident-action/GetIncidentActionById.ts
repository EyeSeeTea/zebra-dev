import { FutureData } from "../../../../data/api-futures";
import { IncidentResponseActionDataValues } from "../../../../data/repositories/IncidentActionD2Repository";
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
                id: incidentActionPlan?.id ?? "",
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
                        const responseActions =
                            responseActionDataValues?.map(responseActionDataValue => {
                                return new ResponseAction({
                                    id: responseActionDataValue?.id ?? "",
                                    mainTask: responseActionDataValue?.mainTask ?? "",
                                    subActivities: responseActionDataValue?.subActivities ?? "",
                                    subPillar: responseActionDataValue?.subPillar ?? "",
                                    searchAssignRO: responseActionOptions.searchAssignRO,
                                    dueDate: responseActionDataValue?.dueDate
                                        ? new Date(responseActionDataValue.dueDate)
                                        : new Date(),
                                    timeLine: responseActionDataValue?.timeLine ?? "",
                                    status: responseActionOptions.status?.id as Status,
                                    verification: responseActionOptions.verification
                                        ?.id as Verification,
                                });
                            }) ?? [];

                        const incidentAction = new IncidentActionPlan({
                            id: diseaseOutbreakId,
                            lastUpdated: new Date(),
                            actionPlan: actionPlan,
                            responseActions: responseActions,
                        });

                        return Future.success(incidentAction);
                    });
                });
        });
}

function getIncidentResponseActionOptionFutures(
    responseActionsBase: Maybe<IncidentResponseActionDataValues[]>,
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
) {
    const responseActionBase = responseActionsBase ? responseActionsBase[0] : undefined;

    return {
        searchAssignRO: responseActionBase?.searchAssignRO
            ? teamMemberRepository.get(responseActionBase.searchAssignRO)
            : Future.success(undefined),
        status: responseActionBase?.status
            ? optionsRepository.getStatusOption(responseActionBase.status)
            : Future.success(undefined),
        verification: responseActionBase?.verification
            ? optionsRepository.getVerificationOption(responseActionBase.verification)
            : Future.success(undefined),
    };
}
