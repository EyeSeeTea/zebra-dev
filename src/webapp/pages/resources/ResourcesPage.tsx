import React, { useCallback, useEffect, useState } from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { Section } from "../../components/section/Section";
import { Button } from "@material-ui/core";
import { FileFileUpload } from "material-ui/svg-icons";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { useAppContext } from "../../contexts/app-context";
import { ResourceDocument, Template } from "../../../domain/entities/resources/Resource";
import { Maybe } from "../../../utils/ts-utils";
import { DescriptionOutlined, FolderOutlined } from "@material-ui/icons";

export const ResourcesPage: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();
    // const { changeCurrentEventTracker, getCurrentEventTracker } = useCurrentEventTracker();
    // const currentEventTracker = getCurrentEventTracker();

    const { goTo } = useRoutes();

    const onUploadFileClick = useCallback(() => {
        goTo(RouteName.CREATE_FORM, { formType: "resource" });
    }, [goTo]);

    const [resources, setResources] = useState<
        Maybe<{
            templates: Template[];
            resourceDocuments: ResourceDocument[];
        }>
    >(undefined);

    useEffect(() => {
        compositionRoot.resources.get.execute().run(
            resources => {
                setResources(resources);
            },
            error => console.debug({ error })
        );
    }, [compositionRoot.resources.get]);

    // useEffect(() => {
    //     if (
    //         currentEventTracker &&
    //         (currentEventTracker.incidentActionPlan?.actionPlan?.lastUpdated !==
    //             incidentActionPlan?.actionPlan?.lastUpdated ||
    //             currentEventTracker.incidentActionPlan?.responseActions.length !==
    //                 incidentActionPlan?.responseActions.length)
    //     ) {
    //         const updatedEventTracker = new DiseaseOutbreakEvent({
    //             ...currentEventTracker,
    //             resource: resources,
    //         });

    //         changeCurrentEventTracker(updatedEventTracker);
    //     }
    // }, [changeCurrentEventTracker, currentEventTracker]);

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
                {resources &&
                (resources.resourceDocuments.length > 0 || resources.templates.length > 0) ? (
                    <div
                        style={{
                            display: "grid",
                            width: "100%",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "16px",
                        }}
                    >
                        {resources.resourceDocuments.length > 0 && (
                            <div>
                                <p>Response Documents</p>

                                <div style={{ backgroundColor: "white", padding: "8px 16px" }}>
                                    {resources.resourceDocuments.map(responseDocument => {
                                        return (
                                            <p
                                                key={responseDocument.resourceLabel}
                                                style={{ display: "flex", gap: "0 8px" }}
                                            >
                                                <FolderOutlined fontSize="small" />
                                                <span> {responseDocument.resourceFolder}</span>
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {resources.templates.length > 0 && (
                            <div>
                                <p>Templates</p>
                                <div style={{ backgroundColor: "white", padding: "8px 16px" }}>
                                    {resources.templates.map(template => {
                                        return (
                                            <p
                                                key={template.resourceLabel}
                                                style={{ display: "flex", gap: "0 8px" }}
                                            >
                                                <DescriptionOutlined fontSize="small" />
                                                <span>{template.resourceLabel}</span>
                                            </p>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No resources created</p>
                )}
            </Section>
        </Layout>
    );
});
