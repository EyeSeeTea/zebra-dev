import { TreeItem as TreeItemMUI } from "@material-ui/lab";
import React from "react";
import { ResponseDocumentsByFolder } from "../../../domain/usecases/GetResourcesUseCase";
import styled from "styled-components";
import { ResourceLabel } from "../../pages/resources/ResourceLabel";

type ResponseDocumentHierarchyItemProps = {
    isDeleting: boolean;
    responseDocument: ResponseDocumentsByFolder;
    onDelete: () => void;
};

export const ResponseDocumentHierarchyItem: React.FC<ResponseDocumentHierarchyItemProps> =
    React.memo(props => {
        const { isDeleting, responseDocument, onDelete } = props;

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
