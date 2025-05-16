import { useCallback } from "react";
import i18n from "../../../../utils/i18n";
import { ModalData } from "../../../components/form/Form";
import { useAppContext } from "../../../contexts/app-context";
import { isExistingResource } from "../../../../domain/entities/resources/Resource";
import { ConfigurableForm } from "../../../../domain/entities/ConfigurableForm";
import { GlobalMessage } from "../useForm";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";

export function useResourceForm(options: {
    editMode: boolean;
    setIsLoading: (isLoading: boolean) => void;
    setOpenModal: (openModal: boolean) => void;
    setModalData: (modalData: ModalData) => void;
    setGlobalMessage: (message: GlobalMessage) => void;
}) {
    const { goTo } = useRoutes();
    const { compositionRoot, configurations } = useAppContext();

    const { editMode, setOpenModal, setModalData, setGlobalMessage, setIsLoading } = options;

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

    const onSaveResourceForm = useCallback(
        (formData: ConfigurableForm) => {
            compositionRoot.resources.get.execute().run(
                resources => {
                    if (!formData.entity || formData.type !== "resource") return;

                    const isResourceExisting = isExistingResource(resources, formData.entity);
                    if (isResourceExisting) {
                        setOpenModal(true);
                        setModalData({
                            title: i18n.t("Warning"),
                            content: i18n.t(
                                "You have uploaded a new resource with an existing file name. This action will replace the current resource. Are you sure you want to continue?"
                            ),
                            cancelLabel: i18n.t("Cancel"),
                            confirmLabel: i18n.t("Save"),
                            onConfirm: () => {
                                onSaveResource(formData);
                            },
                        });
                    } else {
                        onSaveResource(formData);
                    }
                },
                error => {
                    setGlobalMessage({
                        text: i18n.t(`Error fetching resources: ${error.message}`),
                        type: "error",
                    });
                }
            );
        },
        [
            compositionRoot.resources.get,
            onSaveResource,
            setGlobalMessage,
            setModalData,
            setOpenModal,
        ]
    );

    return {
        onSaveResourceForm: onSaveResourceForm,
    };
}
