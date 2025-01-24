import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Maybe } from "../../../utils/ts-utils";
import { GlobalMessage } from "../form-page/useForm";
import {
    isResponseDocument,
    isTemplate,
    Resource,
    ResourceType,
    ResponseDocument,
    Template,
} from "../../../domain/entities/resources/Resource";
import { Id } from "../../../domain/entities/Ref";
import _c from "../../../domain/entities/generic/Collection";
import { ResourcePermissions } from "../../../domain/entities/resources/ResourcePermissions";

export type ResponseDocumentsByFolder = {
    resourceFolder: string;
    resourceType: ResourceType;
    resources: {
        resourceFileId: Maybe<Id>;
        resourceLabel: string;
    }[];
};

export type ResourceData = {
    templates: Template[];
    responseDocuments: ResponseDocumentsByFolder[];
};

export function useResources() {
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
        compositionRoot.resources.get.execute().run(
            resources => {
                const resourceData: ResourceData = getResourceData(resources);
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
    }, [compositionRoot.resources.get]);

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

function getResourceData(resources: Resource[]) {
    const templates = resources.filter(resource => isTemplate(resource)) as Template[];
    const resourceDocumentsByFolder = getResponseDocumentsByFolder(resources);

    const resourceData: ResourceData = {
        templates: templates,
        responseDocuments: resourceDocumentsByFolder,
    };
    return resourceData;
}

function getResponseDocumentsByFolder(resources: Resource[]): ResponseDocumentsByFolder[] {
    const responseDocuments = resources.filter(resource =>
        isResponseDocument(resource)
    ) as ResponseDocument[];
    const groupedResources = _c(responseDocuments)
        .groupBy(responseDocument => responseDocument.resourceFolder)
        .values();

    const responseDocumentsByFolder: ResponseDocumentsByFolder[] = _c(groupedResources)
        .compactMap(group => {
            const responseDocument = group[0];
            if (!responseDocument) return undefined;

            return {
                resourceFolder: responseDocument.resourceFolder,
                resourceType: responseDocument.resourceType,
                resources: group.map(({ resourceFileId, resourceLabel }) => ({
                    resourceFileId: resourceFileId,
                    resourceLabel: resourceLabel,
                })),
            };
        })
        .value();

    return responseDocumentsByFolder;
}
