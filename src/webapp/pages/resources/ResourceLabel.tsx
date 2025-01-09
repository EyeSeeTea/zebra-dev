import styled from "styled-components";
import { ResourceBase } from "../../../domain/entities/resources/Resource";
import { Delete, DescriptionOutlined } from "@material-ui/icons";
import { Link } from "@mui/material";
import { useEffect } from "react";
import { Button } from "@material-ui/core";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useResourceFile } from "./useResourceFile";

interface ResourceLabelProps {
    resource: ResourceBase;
}

export const ResourceLabel: React.FC<ResourceLabelProps> = ({ resource }) => {
    const snackbar = useSnackbar();
    const { resourceFileId, resourceLabel } = resource;
    const { globalMessage, resourceFile, deleteResource } = useResourceFile(resourceFileId);

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
    }, [globalMessage, snackbar]);

    return (
        <StyledTemplateLabel key={resourceLabel}>
            <p>
                <DescriptionOutlined fontSize="small" />
                <Link
                    href={resourceFile ? URL.createObjectURL(resourceFile.file) : undefined}
                    download={resourceLabel}
                    underline="hover"
                >
                    {resourceLabel}
                </Link>
            </p>

            {resourceFileId && (
                <Button onClick={() => deleteResource(resourceFileId)}>
                    <Delete fontSize="small" color="error" />
                </Button>
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
