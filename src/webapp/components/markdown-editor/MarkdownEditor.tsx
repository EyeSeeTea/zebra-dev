import React, { useState } from "react";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import styled from "styled-components";
import { FormHelperText, InputLabel } from "@material-ui/core";
import MarkdownPreview from "./MarkdownPreview";

type MarkdownEditorProps = {
    id: string;
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
    helperText?: string;
    errorText?: string;
    required?: boolean;
    error?: boolean;
};

const MarkdownEditor: React.FC<MarkdownEditorProps> = React.memo(
    ({
        id,
        label,
        value,
        onChange,
        helperText = "",
        errorText = "",
        required = false,
        error = false,
    }) => {
        const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

        return (
            <MarkdownEditorContainer>
                {label && (
                    <Label className={required ? "required" : ""} htmlFor={id}>
                        {label}
                    </Label>
                )}

                <ReactMde
                    value={value}
                    onChange={onChange}
                    selectedTab={selectedTab}
                    onTabChange={setSelectedTab}
                    generateMarkdownPreview={markdown =>
                        Promise.resolve(<MarkdownPreview value={markdown} />)
                    }
                    toolbarCommands={[
                        ["bold", "italic"],
                        ["unordered-list", "ordered-list"],
                        ["link", "code"],
                    ]}
                />

                <StyledFormHelperText id={`${id}-helper-text`} error={error && !!errorText}>
                    {error && !!errorText ? errorText : helperText}
                </StyledFormHelperText>
            </MarkdownEditorContainer>
        );
    }
);

export default MarkdownEditor;

const MarkdownEditorContainer = styled.div`
    width: 100%;
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
