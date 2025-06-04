import { D2Api } from "@eyeseetea/d2-api/2.36";
import { OutbreakAlert } from "../../domain/entities/alert/OutbreakAlert";
import { OutbreakAlertRepository } from "../../domain/repositories/OutbreakAlertRepository";
import { Attribute, D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    RTSL_ZEBRA_ALERTS_SUSPECTED_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_PROGRAM_ID,
    RTSL_ZEBRA_ORG_UNIT_ID,
    RTSL_ZEBRA_ALERTS_IBS_OUTBREAK_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_EBS_EMS_ID_TEA_ID,
    RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_ID,
    RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_CODE,
} from "./consts/DiseaseOutbreakConstants";
import { Code, Id } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";
import _ from "../../domain/entities/generic/Collection";
import { getTEAttributeById } from "./utils/MetadataHelper";
import {
    getAlertValueFromMap,
    mapTrackedEntityAttributesToNotificationOptions,
} from "./utils/AlertOutbreakMapper";
import { getAllTrackedEntitiesAsync, programStatusOptions } from "./utils/getAllTrackedEntities";
import { Maybe } from "../../utils/ts-utils";
import { NotificationOptions } from "../../domain/repositories/NotificationRepository";
import { Alert } from "../../domain/entities/alert/Alert";
import { getDiseaseOptions } from "./common/getDiseaseOptions";

export class OutbreakAlertD2Repository implements OutbreakAlertRepository {
    constructor(private api: D2Api) {}

    getOutbreakAlertsWithoutNationalId(): FutureData<OutbreakAlert[]> {
        return this.getAlertTrackedEntities().map(alertTEIs => {
            const alertsWithNoEventId = _(alertTEIs)
                .compactMap(trackedEntity => {
                    const {
                        maybeConfirmedDiseaseAttribute,
                        maybeNationalEventIdAttribute,
                        maybeIBSIdAttribute,
                    } = this.getAlertTEAttributes(trackedEntity);
                    const notificationOptions =
                        mapTrackedEntityAttributesToNotificationOptions(trackedEntity);

                    if (!maybeConfirmedDiseaseAttribute) return undefined;

                    const confirmedDiseaseCode = maybeConfirmedDiseaseAttribute.value;

                    const outbreakAlertData: OutbreakAlert = this.buildAlertData(
                        trackedEntity,
                        confirmedDiseaseCode,
                        notificationOptions
                    );

                    const needsToMapNationalId =
                        !maybeNationalEventIdAttribute && !!maybeIBSIdAttribute;

                    return needsToMapNationalId ? outbreakAlertData : undefined;
                })
                .value();

            return alertsWithNoEventId;
        });
    }

    updateConfirmedDiseaseInAlerts(): FutureData<void> {
        return Future.joinObj({
            alertTEIs: this.getAlertTrackedEntities(),
            diseaseOptions: getDiseaseOptions(this.api),
        }).flatMap(({ alertTEIs, diseaseOptions }) => {
            const alertsTEIsWithoutConfirmedDisease =
                this.getIBSAlertsWithoutConfirmedDisease(alertTEIs);

            if (alertsTEIsWithoutConfirmedDisease.length === 0) {
                return Future.success(undefined);
            }

            const alertTEIsWithConfirmedDisease: D2TrackerTrackedEntity[] =
                alertsTEIsWithoutConfirmedDisease.reduce(
                    (
                        acc: D2TrackerTrackedEntity[],
                        trackedEntity: D2TrackerTrackedEntity
                    ): D2TrackerTrackedEntity[] => {
                        const { maybeSuspectedDiseaseAttribute } =
                            this.getAlertTEAttributes(trackedEntity);

                        const suspectedDiseaseCode = maybeSuspectedDiseaseAttribute?.value;
                        const confirmedDiseaseValue =
                            diseaseOptions.options.find(
                                option => option.code === suspectedDiseaseCode
                            )?.code || "RTSL_ZEB_OS_DISEASE_UNKNOWN";

                        const restAttributes: Attribute[] =
                            trackedEntity.attributes?.filter(
                                attribute =>
                                    attribute.code !== RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_CODE
                            ) || [];

                        const updatedAttributes: Attribute[] = [
                            ...restAttributes,
                            {
                                attribute: RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_ID,
                                code: RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_CODE,
                                value: confirmedDiseaseValue,
                            },
                        ];

                        return [
                            ...acc,
                            {
                                ...trackedEntity,
                                attributes: updatedAttributes,
                            },
                        ];
                    },
                    []
                );

            if (alertTEIsWithConfirmedDisease.length === 0) {
                return Future.success(undefined);
            } else {
                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "UPDATE" },
                        { trackedEntities: alertTEIsWithConfirmedDisease }
                    )
                ).flatMap(response => {
                    if (response.status !== "OK") {
                        return Future.error(
                            new Error(
                                `Error saving alerts with Confirmed Disease: ${response.message}`
                            )
                        );
                    } else return Future.success(undefined);
                });
            }
        });
    }

    private getIBSAlertsWithoutConfirmedDisease(
        alertTrackedEntities: D2TrackerTrackedEntity[]
    ): D2TrackerTrackedEntity[] {
        return alertTrackedEntities.filter(trackedEntity => {
            const { maybeConfirmedDiseaseAttribute, maybeIBSIdAttribute } =
                this.getAlertTEAttributes(trackedEntity);
            return (
                (!maybeConfirmedDiseaseAttribute || maybeConfirmedDiseaseAttribute.value === "") &&
                maybeIBSIdAttribute &&
                maybeIBSIdAttribute.value !== ""
            );
        });
    }

    private buildAlertData(
        trackedEntity: D2TrackerTrackedEntity,
        confirmedDiseaseCode: Code,
        notificationOptions: NotificationOptions
    ): OutbreakAlert {
        if (!trackedEntity.trackedEntity || !trackedEntity.orgUnit)
            throw new Error(`Alert data not found for ${confirmedDiseaseCode}`);

        const suspectedDiseaseCode = getAlertValueFromMap("suspectedDisease", trackedEntity);

        const alert: Alert = {
            id: trackedEntity.trackedEntity,
            districtId: trackedEntity.orgUnit,
            suspectedDiseaseCode: suspectedDiseaseCode,
            confirmedDiseaseCode: confirmedDiseaseCode,
        };

        return {
            alert: alert,
            notificationOptions: notificationOptions,
        };
    }

    private getAlertTEAttributes(trackedEntity: D2TrackerTrackedEntity): {
        maybeSuspectedDiseaseAttribute: Maybe<Attribute>;
        maybeConfirmedDiseaseAttribute: Maybe<Attribute>;
        maybeNationalEventIdAttribute: Maybe<Attribute>;
        maybeIBSIdAttribute: Maybe<Attribute>;
        maybeEBSIdAttribute: Maybe<Attribute>;
    } {
        const maybeNationalEventIdAttribute = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_NATIONAL_DISEASE_OUTBREAK_EVENT_ID_TEA_ID
        );
        const maybeSuspectedDiseaseAttribute = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_SUSPECTED_DISEASE_TEA_ID
        );
        const maybeConfirmedDiseaseAttribute = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_CONFIRMED_DISEASE_TEA_ID
        );
        const maybeIBSIdAttribute = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_IBS_OUTBREAK_ID_TEA_ID
        );

        const maybeEBSIdAttribute = getTEAttributeById(
            trackedEntity,
            RTSL_ZEBRA_ALERTS_EBS_EMS_ID_TEA_ID
        );

        return {
            maybeSuspectedDiseaseAttribute,
            maybeConfirmedDiseaseAttribute,
            maybeNationalEventIdAttribute,
            maybeIBSIdAttribute,
            maybeEBSIdAttribute,
        };
    }

    private getTrackedEntitiesByTEACode(options: {
        program: Id;
        orgUnit: Id;
        ouMode: "SELECTED" | "DESCENDANTS";
    }): FutureData<D2TrackerTrackedEntity[]> {
        const { program, orgUnit, ouMode } = options;

        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, {
                programId: program,
                orgUnitId: orgUnit,
                ouMode: ouMode,
                programStatus: programStatusOptions.ACTIVE,
            })
        );
    }

    private getAlertTrackedEntities(): FutureData<D2TrackerTrackedEntity[]> {
        return this.getTrackedEntitiesByTEACode({
            program: RTSL_ZEBRA_ALERTS_PROGRAM_ID,
            orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
            ouMode: "DESCENDANTS",
        });
    }
}
