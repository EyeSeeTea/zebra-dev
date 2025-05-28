import styled from "styled-components";
import i18n from "../../../utils/i18n";
import { Delete, DescriptionOutlined } from "@material-ui/icons";
import { Link } from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useResourceFile } from "./useResourceFile";
import { Loader } from "../../components/loader/Loader";
import { SimpleModal } from "../../components/simple-modal/SimpleModal";
import { ResourcePresentationData } from "./useResources";

type ResourceLabelProps = {
    isDeleting: boolean;
    resource: ResourcePresentationData;
    userCanDelete: boolean;
    userCanDownload: boolean;
    onDelete?: () => void;
};

export const ResourceLabel: React.FC<ResourceLabelProps> = ({
    isDeleting,
    resource,
    userCanDelete,
    userCanDownload,
    onDelete,
}) => {
    const snackbar = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const { fileId, name, id, diseaseOutbreakEventName } = resource;
    const { globalMessage, resourceFile, deleteResource } = useResourceFile({
        resourceFileId: fileId,
        onDelete: onDelete,
    });

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
    }, [globalMessage, snackbar]);

    return (
        <StyledTemplateLabel key={id}>
            <p>
                <DescriptionOutlined fontSize="small" />
                {userCanDownload ? (
                    <Link
                        href={resourceFile ? URL.createObjectURL(resourceFile.file) : undefined}
                        download={name}
                        underline="hover"
                    >
                        {`${name}${
                            diseaseOutbreakEventName ? ` (${diseaseOutbreakEventName})` : ""
                        }`}
                    </Link>
                ) : (
                    name
                )}
            </p>

            {fileId && userCanDelete && onDelete && (
                <>
                    <Button onClick={() => setOpenModal(true)}>
                        <Delete fontSize="small" color="error" />
                    </Button>

                    <SimpleModal
                        open={openModal}
                        onClose={() => setOpenModal(false)}
                        title={"Delete resource"}
                        closeLabel={i18n.t("Cancel")}
                        alignFooterButtons="end"
                        footerButtons={
                            <>
                                {isDeleting && <Loader />}
                                <StyledButton
                                    variant="contained"
                                    onClick={() => deleteResource(id, fileId)}
                                >
                                    {i18n.t("Delete")}
                                </StyledButton>
                            </>
                        }
                    >
                        <p>
                            {i18n.t(
                                "Are you sure you want to delete this resource? This action cannot be undone."
                            )}
                        </p>
                    </SimpleModal>
                </>
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

const StyledButton = styled(Button)`
    background-color: ${props => props.theme.palette.error.main};
    color: ${props => props.theme.palette.common.white};
`;
