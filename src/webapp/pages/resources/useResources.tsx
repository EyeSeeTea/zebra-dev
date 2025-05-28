import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Maybe } from "../../../utils/ts-utils";
import { GlobalMessage } from "../form-page/useForm";
import {
    DiseaseOutbreakEventDocument,
    isDiseaseOutbreakEventDocument,
    isResponseDocument,
    isTemplate,
    Resource,
    ResponseDocument,
    Template,
} from "../../../domain/entities/resources/Resource";
import _c from "../../../domain/entities/generic/Collection";
import { ResourcePermissions } from "../../../domain/entities/resources/ResourcePermissions";
import { DiseaseOutbreakEventBaseAttrs } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { ResourceType } from "../../../domain/entities/resources/ResourceTypeNamed";

export type ResourcePresentationData = Resource & {
    diseaseOutbreakEventName?: string;
};

export type ResponseDocumentsByFolder = {
    resourceType: ResourceType.RESPONSE_DOCUMENT;
    resourceFolder: string;
    resources: ResourcePresentationData[];
};

export type DiseaseOutbreakEventDocumentsByFolder = {
    resourceFolder: string;
    resourceType: ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT;
    resources: ResourcePresentationData[];
};

export type ResourceData = {
    templates: Template[];
    responseDocumentsByFolder: ResponseDocumentsByFolder[];
    diseaseOutbreakEventDocumentsByFolder: DiseaseOutbreakEventDocumentsByFolder[];
};

export function useResources(diseaseOutbreakId?: Id) {
    const { goTo } = useRoutes();
    const { currentUser, compositionRoot } = useAppContext();

    const [resources, setResources] = useState<Maybe<ResourceData>>(undefined);
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [userPermissions, setUserPermissions] =
        useState<ResourcePermissions>(defaultUserPermissions);

    const { isAccess, isAdmin, isDataCapture } = userPermissions;

    const onUploadFileClick = useCallback(() => {
        goTo(RouteName.CREATE_FORM, { formType: "resource" });
    }, [goTo]);

    const getResources = useCallback(() => {
        Future.joinObj({
            resources: compositionRoot.resources.getAll.execute({
                diseaseOutbreakId: diseaseOutbreakId,
            }),
            activeDiseaseOutbreakEvents: compositionRoot.diseaseOutbreakEvent.getAll.execute(),
        }).run(
            ({ resources, activeDiseaseOutbreakEvents }) => {
                const resourceData: ResourceData = getResourceData(
                    resources,
                    activeDiseaseOutbreakEvents
                );
                setResources(resourceData);
                setIsDeleting(false);
            },
            error => {
                setGlobalMessage({
                    type: "error",
                    text: `Error getting resources: ${error}`,
                });
            }
        );
    }, [
        compositionRoot.diseaseOutbreakEvent.getAll,
        compositionRoot.resources.getAll,
        diseaseOutbreakId,
    ]);

    const handleDelete = useCallback(() => {
        setIsDeleting(true);
        getResources();
    }, [getResources]);

    useEffect(() => {
        getResources();
    }, [getResources]);

    useEffect(() => {
        compositionRoot.resources.getPermissions.execute(currentUser).run(
            permissions => {
                setUserPermissions(permissions);
            },
            error => {
                setGlobalMessage({
                    type: "error",
                    text: `Error getting user permissions: ${error}`,
                });
            }
        );
    }, [compositionRoot.resources.getPermissions, currentUser]);

    const userCanUploadAndDelete = useMemo(() => {
        return isAdmin || isDataCapture;
    }, [isAdmin, isDataCapture]);

    const userCanDownload = useMemo(() => {
        return isAccess || isDataCapture || isAdmin;
    }, [isAccess, isAdmin, isDataCapture]);

    return {
        globalMessage,
        isDeleting,
        resources,
        userCanUploadAndDelete,
        userCanDownload,
        userPermissions,
        handleDelete,
        onUploadFileClick,
    };
}

const defaultUserPermissions = {
    isAdmin: false,
    isDataCapture: false,
    isAccess: true,
};

function getResourceData(
    resources: Resource[],
    allActiveDiseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
) {
    const resourceData: ResourceData = {
        templates: resources.filter(isTemplate),
        responseDocumentsByFolder: getResponseDocumentsByFolder(resources),
        diseaseOutbreakEventDocumentsByFolder: getDiseaseOutbreakEventDocumentsByFolder(
            resources,
            allActiveDiseaseOutbreakEvents
        ),
    };
    return resourceData;
}

function getResponseDocumentsByFolder(resources: Resource[]): ResponseDocumentsByFolder[] {
    const responseDocuments: ResponseDocument[] = resources.filter(isResponseDocument);
    const groupedResources = _c(responseDocuments)
        .groupBy(responseDocument => responseDocument.resourceFolder)
        .values();

    const responseDocumentsByFolderByFolder: ResponseDocumentsByFolder[] = _c(groupedResources)
        .compactMap(group => {
            const responseDocument = group[0];
            if (!responseDocument) return undefined;

            return {
                resourceFolder: responseDocument.resourceFolder,
                resourceType: responseDocument.resourceType,
                resources: group.map(resource => resource),
            };
        })
        .value();

    return responseDocumentsByFolderByFolder;
}

function getDiseaseOutbreakEventDocumentsByFolder(
    resources: Resource[],
    allActiveDiseaseOutbreakEvents: DiseaseOutbreakEventBaseAttrs[]
): DiseaseOutbreakEventDocumentsByFolder[] {
    const diseaseOutbreakEventDocuments: DiseaseOutbreakEventDocument[] = resources.filter(
        isDiseaseOutbreakEventDocument
    );
    const groupedResources = _c(diseaseOutbreakEventDocuments)
        .groupBy(diseaseOutbreakEventDocument => diseaseOutbreakEventDocument.resourceFolder)
        .values();

    const diseaseOutbreakEventDocumentsByFolderByFolder: DiseaseOutbreakEventDocumentsByFolder[] =
        _c(groupedResources)
            .compactMap(group => {
                const responseDocument = group[0];
                if (!responseDocument) return undefined;

                return {
                    resourceFolder: responseDocument.resourceFolder,
                    resourceType: responseDocument.resourceType,
                    resources: group.map(resource => ({
                        ...resource,
                        diseaseOutbreakEventName:
                            allActiveDiseaseOutbreakEvents.find(
                                event => event.id === resource.diseaseOutbreakEventId
                            )?.name || "",
                    })),
                };
            })
            .value();

    return diseaseOutbreakEventDocumentsByFolderByFolder;
}
