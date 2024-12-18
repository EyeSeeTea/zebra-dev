import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import i18n from "../../../utils/i18n";
import { CustomDropzoneRef, Dropzone } from "./Dropzone";
import BackupIcon from "@material-ui/icons/Backup";
import CloseIcon from "@material-ui/icons/Close";
import WarningIcon from "@material-ui/icons/Warning";
import { Button } from "../button/Button";
import { FileRejection } from "react-dropzone/.";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { FormHelperText, InputLabel, Link } from "@mui/material";
import { Maybe } from "../../../utils/ts-utils";
import { IconButton } from "../icon-button/IconButton";
import { SimpleModal } from "../simple-modal/SimpleModal";
import { readFile } from "../../pages/form-page/utils/FileHelper";
import { SheetData } from "../form/FormFieldsState";
import { Id } from "../../../domain/entities/Ref";

type ImportFileProps = {
    id: string;
    fileTemplate: Maybe<File>;
    file: Maybe<File>;
    fileId: Maybe<Id>;
    onChange: (file: File | undefined, sheetsData: SheetData[] | undefined) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    error?: boolean;
    required?: boolean;
};

export const ImportFile: React.FC<ImportFileProps> = React.memo(props => {
    const {
        file,
        onChange,
        label,
        id,
        helperText,
        errorText,
        error,
        required,
        fileTemplate,
        fileId,
    } = props;

    const snackbar = useSnackbar();
    const dropzoneRef = useRef<CustomDropzoneRef>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openErrorsModal, setOpenErrorsModal] = useState(false);

    const openFileUploadDialog = useCallback(() => {
        dropzoneRef.current?.openDialog();
    }, [dropzoneRef]);

    const onDropFile = useCallback(
        (files: File[], rejections: FileRejection[]) => {
            const handleFileUpload = async () => {
                const uploadedFile = files[0];
                if (rejections.length > 0 || !uploadedFile) {
                    snackbar.error(i18n.t("Multiple uploads not allowed, please select one file"));
                } else {
                    const spreadsheets = await readFile(uploadedFile);
                    onChange(uploadedFile, spreadsheets);
                }
            };

            handleFileUpload().catch(error => {
                snackbar.error(i18n.t("Error uploading file."));
                console.error("Error uploading file:", error);
            });
        },
        [onChange, snackbar]
    );

    const onOpenConfirmationModalRemoveFile = useCallback(() => {
        setOpenDeleteModal(true);
    }, []);

    const onOpenErrorsModal = useCallback(() => {
        setOpenErrorsModal(true);
    }, []);

    const onConfirmRemoveFile = useCallback(() => {
        onChange(undefined, undefined);
        setOpenDeleteModal(false);
    }, [onChange]);

    return (
        <Container>
            {label && (
                <Label className={required ? "required" : ""} htmlFor={id}>
                    {label}
                </Label>
            )}
            <FlexContainer>
                <FlexContainer gap={8}>
                    <Dropzone ref={dropzoneRef} onDrop={onDropFile} maxFiles={1}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<BackupIcon />}
                            onClick={openFileUploadDialog}
                            disabled={props.disabled || !!file}
                        >
                            {i18n.t("Select a file")}
                        </Button>
                    </Dropzone>
                    {error && !!errorText && (
                        <>
                            <IconButton
                                className="errors-file"
                                icon={<WarningIcon />}
                                ariaLabel="Show error messages"
                                onClick={onOpenErrorsModal}
                            />
                            <SimpleModal
                                open={openErrorsModal}
                                onClose={() => setOpenErrorsModal(false)}
                                title={i18n.t("Errors in cases data file")}
                                closeLabel={i18n.t("Close")}
                            >
                                {openErrorsModal && <ErrorsText>{errorText}</ErrorsText>}
                            </SimpleModal>
                        </>
                    )}
                </FlexContainer>
                {fileTemplate && (
                    <Link
                        href={URL.createObjectURL(fileTemplate)}
                        download={fileTemplate.name}
                        underline="hover"
                    >
                        {i18n.t("Download empty template")}
                    </Link>
                )}
            </FlexContainer>
            {file && (
                <RemoveContainer>
                    <IconButton
                        className="remove-file"
                        icon={<CloseIcon />}
                        ariaLabel="Delete current uploaded file"
                        onClick={onOpenConfirmationModalRemoveFile}
                    />
                    <Link
                        href={URL.createObjectURL(file)}
                        download={fileId ? "HISTORICAL_CASE_DATA" : file.name}
                        underline="hover"
                    >
                        {fileId ? i18n.t("Download historical data") : file.name}
                    </Link>
                    <SimpleModal
                        open={openDeleteModal}
                        onClose={() => setOpenDeleteModal(false)}
                        title={i18n.t("Confirm remove the file")}
                        closeLabel={i18n.t("Cancel")}
                        footerButtons={
                            <Button onClick={onConfirmRemoveFile}>{i18n.t("Delete")}</Button>
                        }
                    >
                        {openDeleteModal && (
                            <Text>{i18n.t(`Are you sure you want to remove the file?`)}</Text>
                        )}
                    </SimpleModal>
                </RemoveContainer>
            )}
            {helperText && (
                <StyledFormHelperText id={`${id}-helper-text`}>{helperText}</StyledFormHelperText>
            )}
        </Container>
    );
});

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const FlexContainer = styled.div<{ gap?: number }>`
    display: flex;
    align-items: center;
    gap: ${props => (props.gap ? props.gap : 24)}px;
    .errors-file {
        color: ${props => props.theme.palette.common.red700};
    }
`;

const Label = styled(InputLabel)`
    display: inline-block;
    font-weight: 700;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.text.primary};
    margin-block-end: 8px;

    &.required::after {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-start: 4px;
    }
`;

const StyledFormHelperText = styled(FormHelperText)<{ error?: boolean }>`
    color: ${props =>
        props.error ? props.theme.palette.common.red700 : props.theme.palette.common.grey700};
`;

const RemoveContainer = styled.div`
    display: flex;
    align-items: center;
    margin-block-start: 5px;
    .remove-file {
        color: ${props => props.theme.palette.common.red700};
    }
`;

const Text = styled.div`
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;

const ErrorsText = styled.div`
    font-weight: 400;
    font-size: 0.875rem;
    white-space: pre-wrap;
    color: ${props => props.theme.palette.common.red700};
`;

ImportFile.displayName = "ImportFile";
