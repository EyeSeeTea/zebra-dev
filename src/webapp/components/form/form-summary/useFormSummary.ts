import { useEffect, useState } from "react";
import { useAppContext } from "../../../contexts/app-context";
import { Id } from "../../../../domain/entities/Ref";
import {
    DataSource,
    DiseaseOutbreakEvent,
} from "../../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { User } from "../../user-selector/UserSelector";
import { mapTeamMemberToUser } from "../../../pages/form-page/disease-outbreak-event/utils/mapEntityToInitialFormState";
import { Maybe } from "../../../../utils/ts-utils";
import {
    getDateAsLocaleDateTimeString,
    getDateAsMonthYearString,
} from "../../../../data/repositories/utils/DateTimeHelper";

const EventTypeLabel = "Event type";
const DiseaseLabel = "Disease";
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
    const [summaryError, setSummaryError] = useState<string>();

    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.get.execute(id).run(
            diseaseOutbreakEvent => {
                setFormSummary(mapDiseaseOutbreakEventToFormSummary(diseaseOutbreakEvent));
            },
            err => {
                console.debug(err);
                setSummaryError(`Event tracker with id: ${id} does not exist`);
            }
        );
    }, [compositionRoot.diseaseOutbreakEvent.get, id]);

    const mapDiseaseOutbreakEventToFormSummary = (
        diseaseOutbreakEvent: DiseaseOutbreakEvent
    ): FormSummary => {
        const dataSourceLabelValue: LabelWithValue =
            diseaseOutbreakEvent.dataSource === DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS
                ? {
                      label: EventTypeLabel,
                      value: diseaseOutbreakEvent.hazardType ?? "",
                  }
                : {
                      label: DiseaseLabel,
                      value: diseaseOutbreakEvent.suspectedDisease?.name ?? "",
                  };
        return {
            subTitle: diseaseOutbreakEvent.name,
            summary: [
                {
                    label: "Last updated",
                    value: getDateAsLocaleDateTimeString(diseaseOutbreakEvent.lastUpdated),
                },
                dataSourceLabelValue,
                {
                    label: "Event ID",
                    value: diseaseOutbreakEvent.id,
                },
                {
                    label: "Emergence date",
                    value: getDateAsMonthYearString(diseaseOutbreakEvent.emerged.date),
                },
                {
                    label: "Detection date",
                    value: getDateAsMonthYearString(diseaseOutbreakEvent.detected.date),
                },
                {
                    label: "Notification date",
                    value: getDateAsMonthYearString(diseaseOutbreakEvent.notified.date),
                },
            ],
            incidentManager: diseaseOutbreakEvent.incidentManager
                ? mapTeamMemberToUser(diseaseOutbreakEvent.incidentManager)
                : undefined,
        };
    };

    return { formSummary, summaryError };
}
