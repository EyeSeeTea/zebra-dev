import { D2Api } from "@eyeseetea/d2-api/2.36";
import {
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Id } from "../../../domain/entities/Ref";

export async function getAllTrackedEntitiesAsync(
    api: D2Api,
    programId: Id,
    orgUnitId: Id
): Promise<D2TrackerTrackedEntity[]> {
    const d2TrackerTrackedEntities: D2TrackerTrackedEntity[] = [];

    const pageSize = 250;
    let page = 1;
    let result: TrackedEntitiesGetResponse;

    try {
        do {
            result = await api.tracker.trackedEntities
                .get({
                    program: programId,
                    orgUnit: orgUnitId,
                    totalPages: true,
                    page: page,
                    pageSize: pageSize,
                    fields: {
                        attributes: true,
                        orgUnit: true,
                        trackedEntity: true,
                        trackedEntityType: true,
                    },
                })
                .getData();

            d2TrackerTrackedEntities.push(...result.instances);

            page++;
        } while (result.page < Math.ceil((result.total as number) / pageSize));
        return d2TrackerTrackedEntities;
    } catch {
        return [];
    }
}
