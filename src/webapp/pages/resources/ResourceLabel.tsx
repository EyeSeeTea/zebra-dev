import styled from "styled-components";
import { ResourceBase, ResourceFile } from "../../../domain/entities/resources/Resource";
import { Maybe } from "../../../utils/ts-utils";
import { DescriptionOutlined } from "@material-ui/icons";
import { Link } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";

interface ResourceLabelProps {
    resource: ResourceBase;
}

export const ResourceLabel: React.FC<ResourceLabelProps> = ({ resource }) => {
    const { compositionRoot } = useAppContext();
    const [resourceFile, setResourceFile] = useState<Maybe<ResourceFile>>(undefined);

    useEffect(() => {
        compositionRoot.resources.downloadResourceFile.execute(resource.resourceFileId).run(
            resourceFile => {
                setResourceFile(resourceFile);
            },
            err => {
                console.log({ err });
            }
        );
    }, [compositionRoot.resources.downloadResourceFile, resource.resourceFileId]);

    return (
        <StyledTemplateLabel key={resource.resourceLabel}>
            <DescriptionOutlined fontSize="small" />
            <Link
                href={resourceFile ? URL.createObjectURL(resourceFile.file) : undefined}
                download={resource.resourceLabel}
                underline="hover"
            >
                {resource.resourceLabel}
            </Link>
        </StyledTemplateLabel>
    );
};

const StyledTemplateLabel = styled.p`
    display: flex;
    gap: 8px;
    margin: 0;
    cursor: pointer;
`;
