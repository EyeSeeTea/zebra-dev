import React, { useMemo } from "react";
import styled from "styled-components";
import { Selector } from "../selector/Selector";
import { UserCard } from "./UserCard";

export type User = {
    value: string;
    label: string;
    disabled?: boolean;
    workPosition?: string;
    phone: string;
    email: string;
    status?: string;
    src?: string;
    alt?: string;
    teamRoles?: string;
};

type UserSelectorProps = {
    id: string;
    selected?: string;
    onChange: (value: string) => void;
    options: User[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    error?: boolean;
    required?: boolean;
};

export const UserSelector: React.FC<UserSelectorProps> = React.memo(props => {
    const {
        id,
        label,
        placeholder = "",
        selected = "",
        onChange,
        options,
        disabled = false,
        helperText = "",
        errorText = "",
        error = false,
        required = false,
    } = props;

    const selectedUser = useMemo(() => {
        return options.find(option => option.value === selected);
    }, [options, selected]);

    return (
        <ComponentContainer>
            <SelectorContainer>
                <Selector
                    id={id}
                    placeholder={placeholder}
                    label={label}
                    selected={selected}
                    onChange={value => onChange(value)}
                    options={options}
                    helperText={helperText}
                    errorText={errorText}
                    error={error}
                    required={required}
                    disabled={disabled}
                />
            </SelectorContainer>

            {selectedUser && <UserCard selectedUser={selectedUser} />}
        </ComponentContainer>
    );
});

const ComponentContainer = styled.div`
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: flex-end;
    @media (max-width: 800px) {
        flex-direction: column;
        align-items: flex-start;
    }
`;

const SelectorContainer = styled.div`
    margin-block-start: 24px;
    flex: 1;
    max-width: 500px;
    flex-basis: 0;
    @media (max-width: 800px) {
        flex: 1;
        width: 100%;
    }
`;
