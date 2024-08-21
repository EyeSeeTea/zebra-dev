import { useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import { DiseaseOutbreakEvent } from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { User } from "../../user-selector/UserSelector";
import { mapTeamMemberToUser } from "../../../pages/form-page/disease-outbreak-event/utils/mapEntityToInitialFormState";
import { Maybe } from "../../../../utils/ts-utils";

type LabelWithValue = {
    label: string;
    value: string;
};

type FormSummary = {
    subTitle: string;
    summary: LabelWithValue[];

    incidentManager: Maybe<User>;
};
export function useFormSummary(id: Id) {
    const { compositionRoot } = useAppContext();
    const [formSummary, setFormSummary] = useState<FormSummary>();

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.get.execute(id).run(
            diseaseOutbreakEvent => {
                setFormSummary(mapDiseaseOutbreakEventToFormSummary(diseaseOutbreakEvent));
            },
            () => {}
        );
    }, [compositionRoot.diseaseOutbreakEvent.get, id]);

    const mapDiseaseOutbreakEventToFormSummary = (
        diseaseOutbreakEvent: DiseaseOutbreakEvent
    ): FormSummary => {
        return {
            subTitle: diseaseOutbreakEvent.name,
            summary: [
                {
                    label: "Last updated",
                    value: `${diseaseOutbreakEvent.lastUpdated.toLocaleDateString()} ${diseaseOutbreakEvent.lastUpdated.toLocaleTimeString()}`,
                },
                {
                    label: diseaseOutbreakEvent.dataSource === "EBS" ? "Event type" : "Disease",
                    value:
                        diseaseOutbreakEvent.dataSource === "EBS"
                            ? diseaseOutbreakEvent.hazardType ?? ""
                            : diseaseOutbreakEvent.suspectedDisease?.name ?? "",
                },
                {
                    label: "Event ID",
                    value: diseaseOutbreakEvent.id,
                },
                {
                    label: "Emergence date",
                    value: diseaseOutbreakEvent.emerged.date.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    }),
                },
                {
                    label: "Detection date",
                    value: diseaseOutbreakEvent.detected.date.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    }),
                },
                {
                    label: "Notification date",
                    value: diseaseOutbreakEvent.notified.date.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    }),
                },
            ],
            incidentManager: diseaseOutbreakEvent.incidentManager
                ? mapTeamMemberToUser(diseaseOutbreakEvent.incidentManager)
                : undefined,
        };
    };

    return { formSummary };
}
