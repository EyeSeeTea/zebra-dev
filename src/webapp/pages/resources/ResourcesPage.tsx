import React, { useCallback } from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { Section } from "../../components/section/Section";
import { Button } from "@material-ui/core";
import { FileFileUpload } from "material-ui/svg-icons";
import { RouteName, useRoutes } from "../../hooks/useRoutes";

export const ResourcesPage: React.FC = React.memo(() => {
    const { goTo } = useRoutes();

    const onUploadFileClick = useCallback(() => {
        goTo(RouteName.CREATE_FORM, { formType: "resource" });
    }, [goTo]);

    const uploadButton = (
        <Button
            variant="outlined"
            color="secondary"
            onClick={onUploadFileClick}
            startIcon={<FileFileUpload color="grey" />}
        >
            {i18n.t("Upload File")}
        </Button>
    );

    return (
        <Layout title={i18n.t("Resources")}>
            <Section headerButton={uploadButton}>
                <div
                    style={{
                        display: "grid",
                        width: "100%",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "16px",
                    }}
                >
                    <div>
                        <p>Response Documents</p>
                        <div style={{ backgroundColor: "white", padding: "8px 16px" }}>hi</div>
                    </div>
                    <div>
                        <p>Templates</p>
                        <div style={{ backgroundColor: "white", padding: "8px 16px" }}>hi</div>
                    </div>
                </div>
            </Section>
        </Layout>
    );
});
