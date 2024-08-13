import React from "react";
import styled from "styled-components";
import { IconInfo24 } from "@dhis2/ui";

import { Separator } from "../separator/Separator";
import { IconButton } from "../icon-button/IconButton";
import { FieldWidget } from "./FieldWidget";
import { FormFieldState, FormSectionState } from "./FormState";

type FormSectionProps = {
    id: string;
    title?: string;
    required?: boolean;
    hasSeparator?: boolean;
    onClickInfo?: (id: string) => void;
    direction?: "row" | "column";
    subsections?: FormSectionState[];
    fields: FormFieldState[];
    onUpdateField: (updatedField: FormFieldState) => void;
    errorLabels?: Record<string, string>;
};

export const FormSection: React.FC<FormSectionProps> = React.memo(
    ({
        id,
        title,
        hasSeparator = false,
        onClickInfo,
        direction = "row",
        required = false,
        subsections,
        fields,
        onUpdateField,
        errorLabels,
    }) => {
        return (
            <FormSectionContainer>
                {hasSeparator && <Separator margin="12px" />}

                <Container direction={direction}>
                    {title && (
                        <TitleContainer>
                            <RequiredText className={required ? "required" : ""}>
                                {title}
                            </RequiredText>

                            {onClickInfo && (
                                <IconButton
                                    icon={<IconInfo24 />}
                                    ariaLabel="Section information"
                                    onClick={() => onClickInfo(id)}
                                />
                            )}
                        </TitleContainer>
                    )}

                    {fields.length && fields.some(f => f.isVisible) ? (
                        <FormContainer fullWidth={!title || direction === "column"}>
                            {fields.map(field => {
                                if (!field.isVisible) return null;
                                return (
                                    <FieldContainer
                                        key={field.id}
                                        width={field.width}
                                        maxWidth={field.maxWidth}
                                    >
                                        <FieldWidget
                                            field={field}
                                            disabled={field.disabled}
                                            onChange={onUpdateField}
                                            errorLabels={errorLabels}
                                        />
                                    </FieldContainer>
                                );
                            })}
                        </FormContainer>
                    ) : null}

                    {subsections?.map(subsection => (
                        <SubsectionContainer
                            key={subsection.id}
                            direction={subsection.direction || "row"}
                        >
                            {subsection.title && <Title>{subsection.title}</Title>}
                            {subsection.fields.length &&
                            subsection.fields.some(f => f.isVisible) ? (
                                <FieldsContainer>
                                    {subsection.fields.map(field => {
                                        if (!field.isVisible) return null;

                                        return (
                                            <FieldContainer key={field.id} width={field.width}>
                                                <FieldWidget
                                                    key={field.id}
                                                    field={field}
                                                    disabled={field.disabled}
                                                    onChange={onUpdateField}
                                                    errorLabels={errorLabels}
                                                />
                                            </FieldContainer>
                                        );
                                    })}
                                </FieldsContainer>
                            ) : null}
                        </SubsectionContainer>
                    ))}
                </Container>
            </FormSectionContainer>
        );
    }
);

const FormSectionContainer = styled.div`
    width: 100%;
    margin-block-end: 24px;
`;

const Container = styled.div<{ direction: string }>`
    display: flex;
    flex-direction: ${props => props.direction};
    width: 100%;
    gap: ${props => (props.direction === "row" ? "48px" : "45px")};
    align-items: ${props => (props.direction === "row" ? "center" : "flex-start")};
    @media (max-width: 700px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 40px;
    }
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    width: 20%;
`;

const FormContainer = styled.div<{ fullWidth: boolean }>`
    width: ${props => (props.fullWidth ? "100%" : "80%")};
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    align-items: flex-end;
    @media (max-width: 700px) {
        width: 100%;
        gap: 30px;
    }
`;

const RequiredText = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;

    &.required::after {
        content: "*";
        color: ${props => props.theme.palette.common.red};
        margin-inline-start: 4px;
    }

    @media (max-width: 700px) {
        white-space: nowrap;
    }
`;

const FieldsContainer = styled.div`
    display: flex;
    width: 40%;
    align-items: flex-end;
    gap: 20px;
    @media (max-width: 700px) {
        width: 100%;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 30px;
    }
`;

const SubsectionContainer = styled.div<{ direction: string }>`
    display: flex;
    justify-content: space-between;
    flex-direction: ${props => props.direction};
    width: 100%;
    gap: ${props => (props.direction === "row" ? "48px" : "24px")};
    align-items: ${props => (props.direction === "row" ? "center" : "flex-start")};
    @media (max-width: 700px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
    }
`;

const Title = styled.div`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 400;
    width: 60%;
    @media (max-width: 700px) {
        width: 100%;
    }
`;

const FieldContainer = styled.div<{ width?: string; maxWidth?: string }>`
    display: flex;
    width: ${props => props.width || "100%"};
    max-width: ${props => props.maxWidth || "100%"};
    justify-content: flex-end;
    @media (max-width: 700px) {
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 100%;
    }
`;
