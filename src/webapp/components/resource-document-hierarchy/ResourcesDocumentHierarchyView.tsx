import { TreeView as TreeViewMUI } from "@material-ui/lab";
import React from "react";
import { ArrowDropDown, ArrowRight, FolderOpenOutlined, FolderOutlined } from "@material-ui/icons";
import { ResourceDocumentHierarchyItem } from "./ResourceDocumentHierarchyItem";
import {
    DiseaseOutbreakEventDocumentsByFolder,
    ResponseDocumentsByFolder,
} from "../../pages/resources/useResources";

type ResourcesDocumentHierarchyViewProps = {
    isDeleting?: boolean;
    resourcesByFolder: ResponseDocumentsByFolder[] | DiseaseOutbreakEventDocumentsByFolder[];
    userCanDelete: boolean;
    userCanDownload: boolean;
    onDelete?: () => void;
};

export const ResourcesDocumentHierarchyView: React.FC<ResourcesDocumentHierarchyViewProps> =
    React.memo(props => {
        const {
            isDeleting = false,
            resourcesByFolder,
            userCanDelete,
            userCanDownload,
            onDelete,
        } = props;

        const defaultCollapseIcon = (
            <>
                <ArrowDropDown />
                <FolderOpenOutlined />
            </>
        );

        const defaultExpandIcon = (
            <>
                <ArrowRight />
                <FolderOutlined />
            </>
        );

        return (
            <TreeViewMUI
                disableSelection
                defaultCollapseIcon={defaultCollapseIcon}
                defaultExpandIcon={defaultExpandIcon}
            >
                {resourcesByFolder.map(folderWithResources => {
                    return (
                        <ResourceDocumentHierarchyItem
                            key={folderWithResources.resourceFolder}
                            isDeleting={isDeleting}
                            folderWithResources={folderWithResources}
                            userCanDelete={userCanDelete}
                            userCanDownload={userCanDownload}
                            onDelete={onDelete}
                        />
                    );
                })}
            </TreeViewMUI>
        );
    });
