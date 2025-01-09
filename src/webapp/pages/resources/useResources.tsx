import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Maybe } from "../../../utils/ts-utils";
import { ResourceData } from "../../../domain/usecases/GetResourcesUseCase";
import { GlobalMessage } from "../form-page/useForm";

export function useResources() {
    const { goTo } = useRoutes();
    const { compositionRoot } = useAppContext();

    const [resources, setResources] = useState<Maybe<ResourceData>>(undefined);
    const [globalMessage, setGlobalMessage] = useState<Maybe<GlobalMessage>>();
    const [isDeleting, setIsDeleting] = useState(false);

    const onUploadFileClick = useCallback(() => {
        goTo(RouteName.CREATE_FORM, { formType: "resource" });
    }, [goTo]);

    const getResources = useCallback(() => {
        compositionRoot.resources.get.execute().run(
            resources => {
                setResources(resources);
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

    return {
        globalMessage,
        isDeleting,
        resources,
        handleDelete,
        onUploadFileClick,
    };
}
