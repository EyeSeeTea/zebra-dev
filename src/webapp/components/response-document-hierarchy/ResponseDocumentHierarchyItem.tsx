import { TreeItem as TreeItemMUI } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { ResourceLabel } from "../../pages/resources/ResourceLabel";
import { ResponseDocumentsByFolder } from "../../pages/resources/useResources";

type ResponseDocumentHierarchyItemProps = {
    isDeleting: boolean;
    responseDocument: ResponseDocumentsByFolder;
    userCanDelete: boolean;
    userCanDownload: boolean;
    onDelete: () => void;
};

export const ResponseDocumentHierarchyItem: React.FC<ResponseDocumentHierarchyItemProps> =
    React.memo(props => {
        const { isDeleting, responseDocument, userCanDelete, userCanDownload, onDelete } = props;

        return (
            <StyledTreeItemMUI
                nodeId={responseDocument.resourceFolder}
                label={responseDocument.resourceFolder}
            >
                {responseDocument.resources.map(resource => {
                    return (
                        <StyledTreeItemMUI
                            key={resource.resourceLabel}
                            nodeId={resource.resourceLabel}
                            label={
                                <ResourceLabel
                                    isDeleting={isDeleting}
                                    onDelete={onDelete}
                                    resource={{
                                        resourceFileId: resource.resourceFileId,
                                        resourceLabel: resource.resourceLabel,
                                        resourceType: responseDocument.resourceType,
                                    }}
                                    userCanDelete={userCanDelete}
                                    userCanDownload={userCanDownload}
                                />
                            }
                        />
                    );
                })}
            </StyledTreeItemMUI>
        );
    });

const StyledTreeItemMUI = styled(TreeItemMUI)`
    .MuiTreeItem-label {
        margin-left: 12px;
    }
`;
