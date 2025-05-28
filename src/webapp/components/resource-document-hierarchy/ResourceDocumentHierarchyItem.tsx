import { TreeItem as TreeItemMUI } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { ResourceLabel } from "../../pages/resources/ResourceLabel";
import {
    DiseaseOutbreakEventDocumentsByFolder,
    ResponseDocumentsByFolder,
} from "../../pages/resources/useResources";

type ResourceDocumentHierarchyItemProps = {
    isDeleting: boolean;
    folderWithResources: ResponseDocumentsByFolder | DiseaseOutbreakEventDocumentsByFolder;
    userCanDelete: boolean;
    userCanDownload: boolean;
    onDelete?: () => void;
};

export const ResourceDocumentHierarchyItem: React.FC<ResourceDocumentHierarchyItemProps> =
    React.memo(props => {
        const { isDeleting, folderWithResources, userCanDelete, userCanDownload, onDelete } = props;

        return (
            <StyledTreeItemMUI
                nodeId={folderWithResources.folder}
                label={folderWithResources.folder}
            >
                {folderWithResources.resources.map(resource => {
                    return (
                        <StyledTreeItemMUI
                            key={resource.id}
                            nodeId={resource.id}
                            label={
                                <ResourceLabel
                                    isDeleting={isDeleting}
                                    onDelete={onDelete}
                                    resource={resource}
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
