import { FormHelperText, InputLabel } from "@material-ui/core";
import React from "react";
import ReactQuill from "react-quill";
import styled from "styled-components";
import "react-quill/dist/quill.snow.css";

type TextEditorProps = {
    id: string;
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
    helperText?: string;
    errorText?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
};

export const TextEditor: React.FC<TextEditorProps> = React.memo(
    ({
        id,
        label,
        value,
        onChange,
        helperText = "",
        errorText = "",
        required = false,
        disabled = false,
        error = false,
    }) => {
        return (
            <TextEditorContainer>
                {label && (
                    <Label className={required ? "required" : ""} htmlFor={id}>
                        {label}
                    </Label>
                )}

                <ReactQuill
                    value={value}
                    onChange={onChange}
                    modules={{ toolbar: toolbarOptions }}
                    formats={formats}
                    readOnly={disabled}
                />

                <StyledFormHelperText id={`${id}-helper-text`} error={error && !!errorText}>
                    {error && !!errorText ? errorText : helperText}{" "}
                </StyledFormHelperText>
            </TextEditorContainer>
        );
    }
);

export const TextPreview: React.FC<{
    value: string;
}> = React.memo(({ value }) => {
    return <StyledTextPreview dangerouslySetInnerHTML={{ __html: value }} />;
});

const StyledTextPreview = styled.div`
    .ql-size-large {
        font-size: 1.5em;
    }
    .ql-size-huge {
        font-size: 2.5em;
    }
    .ql-size-small {
        font-size: 0.75em;
    }
`;

const TextEditorContainer = styled.div`
    width: 100%;
    .ql-editor {
        line-height: 2;

        p {
            margin: 8px;
        }
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

const toolbarOptions = [
    [{ bold: true }, { italic: true }, { underline: true }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ color: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
];

const formats = ["bold", "italic", "underline", "size", "color", "align", "list", "bullet"];
