import { D2Api } from "@eyeseetea/d2-api/2.36";
import {
    D2TrackerTrackedEntity,
    TrackedEntitiesGetResponse,
} from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import { Id } from "../../../domain/entities/Ref";
import { Maybe } from "../../../utils/ts-utils";

export const programStatusOptions = {
    ACTIVE: "ACTIVE",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
} as const;

export type ProgramStatus = (typeof programStatusOptions)[keyof typeof programStatusOptions];

export async function getAllTrackedEntitiesAsync(
    api: D2Api,
    options: {
        programId: Id;
        orgUnitId: Id;
        ouMode?: "SELECTED" | "DESCENDANTS";
        filter?: { id: string; value: Maybe<string> };
        programStatus?: ProgramStatus;
    }
): Promise<D2TrackerTrackedEntity[]> {
    const { programId, orgUnitId, ouMode, filter, programStatus } = options;
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
                    ouMode: ouMode,
                    totalPages: true,
                    page: page,
                    pageSize: pageSize,
                    fields: fields,
                    filter: filter ? `${filter.id}:eq:${filter.value}` : undefined,
                    ...(programStatus ? { programStatus } : {}),
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

const fields = {
    attributes: true,
    orgUnit: true,
    trackedEntity: true,
    trackedEntityType: true,
    inactive: true,
    enrollments: {
        occurredAt: true,
        status: true,
        enrollment: true,
        program: true,
        orgUnit: true,
        enrolledAt: true,
        events: {
            orgUnit: true,
            status: true,
            createdAt: true,
            occurredAt: true,
            dataValues: {
                dataElement: true,
                value: true,
            },
            event: true,
        },
    },
} as const;
