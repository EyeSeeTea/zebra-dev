import styled from "styled-components";
import { ResourceBase } from "../../../domain/entities/resources/Resource";
import { Delete, DescriptionOutlined } from "@material-ui/icons";
import { Link } from "@mui/material";
import { useEffect } from "react";
import { Button } from "@material-ui/core";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useResourceFile } from "./useResourceFile";
import { Loader } from "../../components/loader/Loader";

interface ResourceLabelProps {
    isDeleting: boolean;
    resource: ResourceBase;
    userCanDelete: boolean;
    userCanDownload: boolean;
    onDelete: () => void;
}

export const ResourceLabel: React.FC<ResourceLabelProps> = ({
    isDeleting,
    resource,
    userCanDelete,
    userCanDownload,
    onDelete,
}) => {
    const snackbar = useSnackbar();
    const { resourceFileId, resourceLabel } = resource;
    const { globalMessage, resourceFile, deleteResource } = useResourceFile({
        resourceFileId: resourceFileId,
        onDelete: onDelete,
    });

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
    }, [globalMessage, snackbar]);

    return (
        <StyledTemplateLabel key={resourceLabel}>
            <p>
                <DescriptionOutlined fontSize="small" />
                {userCanDownload ? (
                    <Link
                        href={resourceFile ? URL.createObjectURL(resourceFile.file) : undefined}
                        download={resourceLabel}
                        underline="hover"
                    >
                        {resourceLabel}
                    </Link>
                ) : (
                    resourceLabel
                )}
            </p>

            {resourceFileId && userCanDelete && (
                <div>
                    {isDeleting && <Loader />}
                    <Button onClick={() => deleteResource(resourceFileId)}>
                        <Delete fontSize="small" color="error" />
                    </Button>
                </div>
            )}
        </StyledTemplateLabel>
    );
};

const StyledTemplateLabel = styled.div`
    display: flex;

    justify-content: space-between;
    align-items: center;

    p {
        display: flex;
        align-items: center;
        gap: 4px;
        margin: 0;
    }
`;
