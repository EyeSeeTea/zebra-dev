import { TreeView as TreeViewMUI } from "@material-ui/lab";
import React from "react";
import { ArrowDropDown, ArrowRight, FolderOpenOutlined, FolderOutlined } from "@material-ui/icons";
import { ResponseDocumentHierarchyItem } from "./ResponseDocumentHierarchyItem";
import { ResponseDocumentsByFolder } from "../../../domain/usecases/GetResourcesUseCase";

type ResponseDocumentHierarchyViewProps = {
    responseDocuments: ResponseDocumentsByFolder[];
};

export const ResponseDocumentHierarchyView: React.FC<ResponseDocumentHierarchyViewProps> =
    React.memo(props => {
        const { responseDocuments } = props;

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
                            responseDocument={responseDocument}
                        />
                    );
                })}
            </TreeViewMUI>
        );
    });
