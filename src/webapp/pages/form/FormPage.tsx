import React from "react";

import { Layout } from "../../components/layout/Layout";
import { FormLayout } from "../../components/form/FormLayout";

export const FormPage: React.FC = React.memo(() => {
    return (
        <Layout title="Form Title" subtitle="Form Subtitle" hideSideBarOptions>
            <FormLayout title="title" subtitle="subtitle" onSave={() => {}}>
                <div>FormPage</div>
            </FormLayout>
        </Layout>
    );
});
