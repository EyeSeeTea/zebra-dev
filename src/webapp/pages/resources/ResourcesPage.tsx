import React, { useEffect } from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { Section } from "../../components/section/Section";
import { Button } from "@material-ui/core";
import { FileFileUpload } from "material-ui/svg-icons";
import styled from "styled-components";
import { ResourcesDocumentHierarchyView } from "../../components/resource-document-hierarchy/ResourcesDocumentHierarchyView";
import { ResourceLabel } from "./ResourceLabel";
import { NoticeBox } from "../../components/notice-box/NoticeBox";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useResources } from "./useResources";

export const ResourcesPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();
    const {
        globalMessage,
        isDeleting,
        resources,
        userCanUploadAndDelete,
        userCanDownload,
        onUploadFileClick,
        handleDelete,
    } = useResources();

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
    }, [globalMessage, snackbar]);

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
            <Section headerButtons={userCanUploadAndDelete ? uploadButton : undefined}>
                {resources &&
                (resources.responseDocumentsByFolder.length > 0 ||
                    resources.templates.length > 0 ||
                    resources.diseaseOutbreakEventDocumentsByFolder.length > 0) ? (
                    <RowFlexContainer>
                        <ColumnFlexContainer>
                            {resources.responseDocumentsByFolder.length > 0 && (
                                <>
                                    <ResourceTypeLabel>
                                        {i18n.t("Response Documents")}
                                    </ResourceTypeLabel>

                                    <Container>
                                        <ResourcesDocumentHierarchyView
                                            resourcesByFolder={resources.responseDocumentsByFolder}
                                            onDelete={handleDelete}
                                            isDeleting={isDeleting}
                                            userCanDelete={userCanUploadAndDelete}
                                            userCanDownload={userCanDownload}
                                        />
                                    </Container>
                                </>
                            )}

                            {resources.diseaseOutbreakEventDocumentsByFolder.length > 0 && (
                                <>
                                    <ResourceTypeLabel>
                                        {i18n.t("Events Documents")}
                                    </ResourceTypeLabel>
                                    <Container>
                                        <ResourcesDocumentHierarchyView
                                            resourcesByFolder={
                                                resources.diseaseOutbreakEventDocumentsByFolder
                                            }
                                            onDelete={handleDelete}
                                            isDeleting={isDeleting}
                                            userCanDelete={userCanUploadAndDelete}
                                            userCanDownload={userCanDownload}
                                        />
                                    </Container>
                                </>
                            )}
                        </ColumnFlexContainer>

                        {resources.templates.length > 0 && (
                            <OtherBlock>
                                <ResourceTypeLabel>{i18n.t("Templates")}</ResourceTypeLabel>
                                <Container>
                                    {resources.templates.map(template => (
                                        <ResourceLabel
                                            key={template.fileId}
                                            resource={template}
                                            isDeleting={isDeleting}
                                            onDelete={handleDelete}
                                            userCanDelete={userCanUploadAndDelete}
                                            userCanDownload={userCanDownload}
                                        />
                                    ))}
                                </Container>
                            </OtherBlock>
                        )}
                    </RowFlexContainer>
                ) : (
                    <NoticeBox title={i18n.t("No resources created")}>
                        {userCanUploadAndDelete
                            ? i18n.t("You can upload a file to create a new resource")
                            : i18n.t("Contact admin to create resources")}
                    </NoticeBox>
                )}
            </Section>
        </Layout>
    );
});

const Container = styled.div`
    background-color: ${props => props.theme.palette.common.white};
    color: ${props => props.theme.palette.common.grey700};
    padding: 8px 16px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
`;

const RowFlexContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    width: 100%;
`;

const ColumnFlexContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1 1 350px;
    min-width: 300px;
    max-width: 100%;
`;

const OtherBlock = styled.div`
    flex: 1 1 350px;
    min-width: 300px;
    max-width: 100%;
`;

const ResourceTypeLabel = styled.p`
    font-size: 20px;
`;
