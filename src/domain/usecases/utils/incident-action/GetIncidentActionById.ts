import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
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
                            optionsRepository,
                            teamMemberRepository
                        )
                    ).flatMap(responseActionOptions => {
                        const { searchAssignROOptions, statusOptions, verificationOptions } =
                            responseActionOptions;

                        const responseActions =
                            responseActionDataValues?.map(responseActionDataValue => {
                                const searchAssignRO = searchAssignROOptions.find(
                                    option =>
                                        option.username === responseActionDataValue?.searchAssignRO
                                );
                                const status = statusOptions.find(
                                    option => option.id === responseActionDataValue?.status
                                )?.id as Status;
                                const verification = verificationOptions.find(
                                    option => option.id === responseActionDataValue?.verification
                                )?.id as Verification;

                                return new ResponseAction({
                                    id: responseActionDataValue?.id ?? "",
                                    mainTask: responseActionDataValue?.mainTask ?? "",
                                    subActivities: responseActionDataValue?.subActivities ?? "",
                                    subPillar: responseActionDataValue?.subPillar ?? "",
                                    searchAssignRO: searchAssignRO,
                                    dueDate: responseActionDataValue?.dueDate
                                        ? new Date(responseActionDataValue.dueDate)
                                        : new Date(),
                                    timeLine: responseActionDataValue?.timeLine ?? "",
                                    status: status,
                                    verification: verification,
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
    optionsRepository: OptionsRepository,
    teamMemberRepository: TeamMemberRepository
) {
    return {
        searchAssignROOptions: teamMemberRepository.getAll(),
        statusOptions: optionsRepository.getStatusOptions(),
        verificationOptions: optionsRepository.getVerificationOptions(),
    };
}
