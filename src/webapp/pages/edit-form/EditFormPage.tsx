import React from "react";

import { Layout } from "../../components/layout/Layout";
import { FormPage } from "../../components/form/FormPage";

export const EditFormPage: React.FC = React.memo(() => {
    return (
        <Layout title="Form Title" subtitle="Form Subtitle" hideSideBarOptions>
            <FormPage title="title" subtitle="subtitle" onSave={() => {}}>
                <div>EditFormPage</div>
            </FormPage>
        </Layout>
    );
});
