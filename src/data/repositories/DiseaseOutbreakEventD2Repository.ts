import { D2Api } from "../../types/d2-api";
import { DiseaseOutbreakEventRepository } from "../../domain/repositories/DiseaseOutbreakEventRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { DiseaseOutbreakEventBaseAttrs } from "../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Id, ConfigLabel } from "../../domain/entities/Ref";
import {
    mapDiseaseOutbreakEventToTrackedEntityAttributes,
    mapTrackedEntityAttributesToDiseaseOutbreak,
} from "./utils/DiseaseOutbreakMapper";
import { RTSL_ZEBRA_ORG_UNIT_ID, RTSL_ZEBRA_PROGRAM_ID } from "./consts/DiseaseOutbreakConstants";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { getProgramTEAsMetadata } from "./utils/MetadataHelper";
import { assertOrError } from "./utils/AssertOrError";
import { Future } from "../../domain/entities/generic/Future";
import { getAllTrackedEntitiesAsync } from "./utils/getAllTrackedEntities";

export class DiseaseOutbreakEventD2Repository implements DiseaseOutbreakEventRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<DiseaseOutbreakEventBaseAttrs> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: RTSL_ZEBRA_PROGRAM_ID,
                orgUnit: RTSL_ZEBRA_ORG_UNIT_ID,
                trackedEntity: id,
                fields: { attributes: true, trackedEntity: true },
            })
        )
            .flatMap(response => assertOrError(response.instances[0], "Tracked entity"))
            .map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
    }

    getAll(): FutureData<DiseaseOutbreakEventBaseAttrs[]> {
        return Future.fromPromise(
            getAllTrackedEntitiesAsync(this.api, RTSL_ZEBRA_PROGRAM_ID, RTSL_ZEBRA_ORG_UNIT_ID)
        ).map(trackedEntities => {
            return trackedEntities.map(trackedEntity => {
                return mapTrackedEntityAttributesToDiseaseOutbreak(trackedEntity);
            });
        });
    }

    save(diseaseOutbreak: DiseaseOutbreakEventBaseAttrs): FutureData<Id> {
        return getProgramTEAsMetadata(this.api, RTSL_ZEBRA_PROGRAM_ID).flatMap(
            teasMetadataResponse => {
                const teasMetadata =
                    teasMetadataResponse.objects[0]?.programTrackedEntityAttributes;

                if (!teasMetadata)
                    return Future.error(
                        new Error(`Program Tracked Entity Attributes metadata not found`)
                    );

                const trackedEntity: D2TrackerTrackedEntity =
                    mapDiseaseOutbreakEventToTrackedEntityAttributes(diseaseOutbreak, teasMetadata);

                return apiToFuture(
                    this.api.tracker.post(
                        { importStrategy: "CREATE_AND_UPDATE" },
                        { trackedEntities: [trackedEntity] }
                    )
                ).flatMap(saveResponse => {
                    const diseaseOutbreakId =
                        saveResponse.bundleReport.typeReportMap.TRACKED_ENTITY.objectReports[0]
                            ?.uid;

                    if (saveResponse.status === "ERROR" || !diseaseOutbreakId) {
                        return Future.error(new Error(`Error saving disease ooutbreak event`));
                    } else {
                        return Future.success(diseaseOutbreakId);
                    }
                });
            }
        );
    }

    getConfigStrings(): FutureData<ConfigLabel[]> {
        throw new Error("Method not implemented.");
    }

    //TO DO : Implement delete/archive after requirement confirmation
}
