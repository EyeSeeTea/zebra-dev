import { useCallback } from "react";
import i18n from "../../../../utils/i18n";
import { useAppContext } from "../../../contexts/app-context";
import { ConfigurableForm } from "../../../../domain/entities/ConfigurableForm";
import { GlobalMessage } from "../useForm";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";

export function useResourceForm(options: {
    editMode: boolean;
    setIsLoading: (isLoading: boolean) => void;
    setGlobalMessage: (message: GlobalMessage) => void;
}) {
    const { goTo } = useRoutes();
    const { compositionRoot, configurations } = useAppContext();

    const { editMode, setGlobalMessage, setIsLoading } = options;

    const onSaveResource = useCallback(
        (formData: ConfigurableForm) => {
            if (formData.type === "resource") {
                setIsLoading(true);
                compositionRoot.save.execute(formData, configurations, editMode).run(
                    () => {
                        setIsLoading(false);
                        setGlobalMessage({
                            text: i18n.t(`Resource saved successfully`),
                            type: "success",
                        });
                        goTo(RouteName.RESOURCES);
                    },
                    error => {
                        setGlobalMessage({
                            text: i18n.t(`Error saving resource: ${error.message}`),
                            type: "error",
                        });
                    }
                );
            }
        },
        [compositionRoot.save, configurations, editMode, goTo, setGlobalMessage, setIsLoading]
    );

    return {
        onSaveResourceForm: onSaveResource,
    };
}
