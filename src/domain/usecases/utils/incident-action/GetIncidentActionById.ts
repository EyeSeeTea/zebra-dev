import { FutureData } from "../../../../data/api-futures";
import { Maybe } from "../../../../utils/ts-utils";
import { Configurations } from "../../../entities/AppConfigurations";
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

export function getIncidentAction(
    diseaseOutbreakId: Id,
    incidentActionRepository: IncidentActionRepository,
    configurations: Configurations
): FutureData<Maybe<IncidentActionPlan>> {
    const { incidentResponseActionConfigurations: responseActionConfig } =
        configurations.selectableOptions;
    return incidentActionRepository
        .getIncidentActionPlan(diseaseOutbreakId)
        .flatMap(incidentActionPlan => {
            const actionPlan = new ActionPlan({
                lastUpdated: incidentActionPlan?.lastUpdated,
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
                    const searchAssignROOptions = responseActionConfig.searchAssignRO;
                    const statusOptions = responseActionConfig.status;
                    const verificationOptions = responseActionConfig.verification;

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

                        actionPlan: actionPlan,
                        responseActions: responseActions,
                        incidentActionOptions: {
                            status: statusOptions,
                            verification: verificationOptions,
                        },
                    });

                    return Future.success(incidentAction);
                });
        });
}
