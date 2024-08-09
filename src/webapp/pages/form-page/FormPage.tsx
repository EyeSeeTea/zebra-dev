import React from "react";
import { useParams } from "react-router-dom";

import i18n from "../../../utils/i18n";
import { DiseaseOutbreakEventForm } from "./disease-outbreak-event/DiseaseOutbreakEventForm";

export type FormType = "disease-outbreak-event";

export const FormPage: React.FC = React.memo(() => {
    const { formType, id } = useParams<{
        formType: FormType;
        id?: string;
    }>();

    switch (formType) {
        case "disease-outbreak-event":
            return <DiseaseOutbreakEventForm diseaseOutbreakEventId={id} formType={formType} />;
        default:
            return <div>{i18n.t("Page Not Found")}</div>;
    }
});
