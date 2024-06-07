import React from "react";
import styled from "styled-components";
import { AddCircleOutline } from "@material-ui/icons";

import i18n from "../../../utils/i18n";

interface AddNewOptionProps {
    id: string;
    label?: string;
    onAddNewOption: () => void;
}

export const AddNewOption: React.FC<AddNewOptionProps> = React.memo(
    ({ id, label = "", onAddNewOption }) => {
        return (
            <Container>
                <StyledAddIcon id={id} aria-label="Add new option" onClick={onAddNewOption} />
                <Label htmlFor={id}>{label || i18n.t("Add new option")}</Label>
            </Container>
        );
    }
);

const Container = styled.div`
    display: flex;
    align-items: center;
`;

const StyledAddIcon = styled(AddCircleOutline)`
    color: ${props => props.theme.palette.icon.color};
`;

const Label = styled.label`
    display: inline-block;
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.black};
    margin-inline-start: 8px;
`;
