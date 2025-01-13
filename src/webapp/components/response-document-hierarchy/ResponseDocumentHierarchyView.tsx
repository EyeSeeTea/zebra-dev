import { TreeView as TreeViewMUI } from "@material-ui/lab";
import React from "react";
import { ArrowDropDown, ArrowRight, FolderOpenOutlined, FolderOutlined } from "@material-ui/icons";
import { ResponseDocumentHierarchyItem } from "./ResponseDocumentHierarchyItem";
import { ResponseDocumentsByFolder } from "../../pages/resources/useResources";

type ResponseDocumentHierarchyViewProps = {
    isDeleting: boolean;
    responseDocuments: ResponseDocumentsByFolder[];
    userCanDelete: boolean;
    userCanDownload: boolean;
    onDelete: () => void;
};

export const ResponseDocumentHierarchyView: React.FC<ResponseDocumentHierarchyViewProps> =
    React.memo(props => {
        const { isDeleting, responseDocuments, userCanDelete, userCanDownload, onDelete } = props;

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
                {responseDocuments.map(responseDocument => {
                    return (
                        <ResponseDocumentHierarchyItem
                            key={responseDocument.resourceFolder}
                            isDeleting={isDeleting}
                            responseDocument={responseDocument}
                            userCanDelete={userCanDelete}
                            userCanDownload={userCanDownload}
                            onDelete={onDelete}
                        />
                    );
                })}
            </TreeViewMUI>
        );
    });
