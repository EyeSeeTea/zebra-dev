import React, { useMemo } from "react";
import styled from "styled-components";
import { Link } from "@material-ui/core";

import i18n from "../../../utils/i18n";
import { Selector } from "../selector/Selector";
import { AvatarCard } from "../avatar-card/AvatarCard";

export type MemberOption = {
    value: string;
    label: string;
    disabled?: boolean;
    workPosition: string;
    phone: string;
    email: string;
    status: string;
    src?: string;
    alt?: string;
};

type MemberSelectorProps = {
    id: string;
    selected?: string;
    onChange: (value: string) => void;
    options: MemberOption[];
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    errorText?: string;
    error?: boolean;
    required?: boolean;
};

export const MemberSelector: React.FC<MemberSelectorProps> = React.memo(props => {
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

    const selectedMember = useMemo(() => {
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
            {selectedMember && (
                <AvatarContainer>
                    <AvatarCard
                        avatarSize="medium"
                        alt={selectedMember?.alt}
                        src={selectedMember?.src}
                    >
                        <Container>
                            <Content>
                                <TextBold>{selectedMember?.label}</TextBold>
                                <Text>{selectedMember?.workPosition}</Text>
                            </Content>
                            <Content>
                                <Text>{selectedMember?.phone}</Text>
                                <StyledLink href={`mailto:${selectedMember?.email}`}>
                                    {selectedMember?.email}
                                </StyledLink>
                            </Content>
                            <div>
                                <TextBold>{i18n.t("Status: ", { nsSeparator: false })}</TextBold>
                                <Text>{selectedMember?.status}</Text>
                            </div>
                        </Container>
                    </AvatarCard>
                </AvatarContainer>
            )}
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

const AvatarContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 2;
    max-width: 400px;
    flex-basis: 0;
    @media (max-width: 800px) {
        align-self: center;
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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TextBold = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 700;
`;

const Text = styled.span`
    color: ${props => props.theme.palette.common.black};
    font-size: 0.875rem;
    font-weight: 400;
`;

const StyledLink = styled(Link)`
    &.MuiTypography-colorPrimary {
        font-size: 0.875rem;
        font-weight: 400;
        text-decoration: underline;
        color: ${props => props.theme.palette.common.black};
    }
`;
