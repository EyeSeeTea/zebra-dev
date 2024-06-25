import React from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { FormPage } from "../../components/form-page/FormPage";
import { FormSection } from "../../components/form-section/FormSection";
import { useHistory } from "react-router-dom";

export const CreateEventPage: React.FC = React.memo(() => {
    const history = useHistory();

    const goBack = () => {
        history.goBack();
    };

    return (
        <Layout title={i18n.t("Create Event")} hideSideBarOptions>
            <FormPage onCancel={goBack} onSave={() => {}}>
                <FormSection title={i18n.t("Event Name")} hasSeparator>
                    <div>test</div>
                </FormSection>
                <FormSection title={i18n.t("Hazard Type")} hasSeparator>
                    <div>test</div>
                </FormSection>
            </FormPage>
        </Layout>
    );
});
