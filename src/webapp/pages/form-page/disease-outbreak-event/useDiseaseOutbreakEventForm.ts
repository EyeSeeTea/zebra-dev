import { useCallback } from "react";

import i18n from "../../../../utils/i18n";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import { RouteName, useRoutes } from "../../../hooks/useRoutes";
import { ConfigurableForm } from "../../../../domain/entities/ConfigurableForm";
import { ModalData } from "../../../components/form/Form";
import {
    CasesDataSource,
    DiseaseOutbreakEvent,
} from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { GlobalMessage } from "../useForm";

type State = {
    onSaveDiseaseOutbreakEvent: (formDataWithEntityData: ConfigurableForm) => void;
};

export function useDiseaseOutbreakEventForm(params: {
    editMode: boolean;
    setIsLoading: (isLoading: boolean) => void;
    setGlobalMessage: (message: GlobalMessage) => void;
    setOpenModal: (openModal: boolean) => void;
    setModalData: (modalData: ModalData) => void;
}): State {
    const { editMode, setIsLoading, setGlobalMessage, setOpenModal, setModalData } = params;

    const { compositionRoot, configurations } = useAppContext();
    const { goTo } = useRoutes();

    const onMapDiseaseOutbreakEventToAlerts = useCallback(
        (diseaseOutbreakEventId: Id, entity: DiseaseOutbreakEvent) => {
            const { eventTrackerConfigurations } = configurations.selectableOptions;

            compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts
                .execute(
                    diseaseOutbreakEventId,
                    entity,
                    eventTrackerConfigurations.suspectedDiseases
                )
                .run(
                    () => {},
                    err => {
                        console.error({ err });
                    }
                );
            goTo(RouteName.EVENT_TRACKER, {
                id: diseaseOutbreakEventId,
            });
            setGlobalMessage({
                text: i18n.t(`Disease Outbreak saved successfully`),
                type: "success",
            });
        },
        [
            compositionRoot.diseaseOutbreakEvent.mapDiseaseOutbreakEventToAlerts,
            configurations.selectableOptions,
            goTo,
            setGlobalMessage,
        ]
    );

    const onSaveDiseaseOutbreakEventWithCaseData = useCallback(
        (formDataWithEntityData: ConfigurableForm) => {
            if (
                formDataWithEntityData.type === "disease-outbreak-event" ||
                formDataWithEntityData.type === "disease-outbreak-event-case-data"
            ) {
                setIsLoading(true);
                compositionRoot.save.execute(formDataWithEntityData, configurations, editMode).run(
                    diseaseOutbreakEventId => {
                        setIsLoading(false);

                        if (
                            diseaseOutbreakEventId &&
                            formDataWithEntityData.entity &&
                            formDataWithEntityData.type === "disease-outbreak-event"
                        ) {
                            onMapDiseaseOutbreakEventToAlerts(
                                diseaseOutbreakEventId,
                                formDataWithEntityData.entity
                            );
                        } else if (
                            diseaseOutbreakEventId &&
                            formDataWithEntityData.type === "disease-outbreak-event-case-data"
                        ) {
                            goTo(RouteName.EVENT_TRACKER, {
                                id: diseaseOutbreakEventId,
                            });
                            setGlobalMessage({
                                text: i18n.t(`Disease outbreak case data saved successfully`),
                                type: "success",
                            });
                        }
                    },
                    err => {
                        setGlobalMessage({
                            text: i18n.t(
                                formDataWithEntityData.type === "disease-outbreak-event-case-data"
                                    ? `Error saving disease outbreak case data: ${err.message}`
                                    : `Error saving disease outbreak: ${err.message}`
                            ),
                            type: "error",
                        });
                    }
                );
            }
        },
        [
            compositionRoot.save,
            configurations,
            editMode,
            goTo,
            onMapDiseaseOutbreakEventToAlerts,
            setGlobalMessage,
            setIsLoading,
        ]
    );

    const onSaveDiseaseOutbreakEvent = useCallback(
        (formDataWithEntityData: ConfigurableForm) => {
            if (
                !formDataWithEntityData.entity ||
                (formDataWithEntityData.type !== "disease-outbreak-event-case-data" &&
                    formDataWithEntityData.type !== "disease-outbreak-event")
            )
                return;

            const haveChangedCasesDataInDiseaseOutbreak =
                editMode &&
                formDataWithEntityData.type === "disease-outbreak-event" &&
                !formDataWithEntityData.uploadedCasesDataFileId &&
                !!formDataWithEntityData.uploadedCasesDataFile &&
                formDataWithEntityData.entity?.casesDataSource ===
                    CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

            if (
                haveChangedCasesDataInDiseaseOutbreak ||
                formDataWithEntityData.type === "disease-outbreak-event-case-data"
            ) {
                setOpenModal(true);
                setModalData({
                    title: i18n.t("Warning"),
                    content: i18n.t(
                        "You have uploaded a new data cases file. This action will replace the current data of this disease outbreak event with the data of the file. Are you sure you want to continue?"
                    ),
                    cancelLabel: i18n.t("Cancel"),
                    confirmLabel: i18n.t("Save"),
                    onConfirm: () => {
                        onSaveDiseaseOutbreakEventWithCaseData(formDataWithEntityData);
                    },
                });
            } else {
                setIsLoading(true);
                compositionRoot.save.execute(formDataWithEntityData, configurations, editMode).run(
                    diseaseOutbreakEventId => {
                        setIsLoading(false);

                        if (diseaseOutbreakEventId && formDataWithEntityData.entity) {
                            onMapDiseaseOutbreakEventToAlerts(
                                diseaseOutbreakEventId,
                                formDataWithEntityData.entity
                            );
                        }
                    },
                    err => {
                        setGlobalMessage({
                            text: i18n.t(`Error saving disease outbreak: ${err.message}`),
                            type: "error",
                        });
                    }
                );
            }
        },
        [
            compositionRoot.save,
            configurations,
            editMode,
            onMapDiseaseOutbreakEventToAlerts,
            onSaveDiseaseOutbreakEventWithCaseData,
            setGlobalMessage,
            setIsLoading,
            setModalData,
            setOpenModal,
        ]
    );

    return {
        onSaveDiseaseOutbreakEvent,
    };
}
