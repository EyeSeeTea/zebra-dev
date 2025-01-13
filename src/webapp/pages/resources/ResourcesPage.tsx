import React, { useEffect } from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { Section } from "../../components/section/Section";
import { Button } from "@material-ui/core";
import { FileFileUpload } from "material-ui/svg-icons";
import styled from "styled-components";
import { ResponseDocumentHierarchyView } from "../../components/response-document-hierarchy/ResponseDocumentHierarchyView";
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
                (resources.responseDocuments.length > 0 || resources.templates.length > 0) ? (
                    <ContentWrapper>
                        {resources.responseDocuments.length > 0 && (
                            <div>
                                <ResourceTypeLabel>Response Documents</ResourceTypeLabel>

                                <Container>
                                    <ResponseDocumentHierarchyView
                                        responseDocuments={resources.responseDocuments}
                                        onDelete={handleDelete}
                                        isDeleting={isDeleting}
                                        userCanDelete={userCanUploadAndDelete}
                                        userCanDownload={userCanDownload}
                                    />
                                </Container>
                            </div>
                        )}

                        {resources.templates.length > 0 && (
                            <div>
                                <ResourceTypeLabel>Templates</ResourceTypeLabel>
                                <Container>
                                    {resources.templates.map(template => (
                                        <ResourceLabel
                                            key={template.resourceFileId}
                                            resource={template}
                                            isDeleting={isDeleting}
                                            onDelete={handleDelete}
                                            userCanDelete={userCanUploadAndDelete}
                                            userCanDownload={userCanDownload}
                                        />
                                    ))}
                                </Container>
                            </div>
                        )}
                    </ContentWrapper>
                ) : (
                    <NoticeBox title={i18n.t("No resources created")}>
                        {i18n.t("You can upload a file to create a new resource")}
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
    height: 100%;
`;

const ContentWrapper = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
`;

const ResourceTypeLabel = styled.p`
    font-size: 20px;
`;
