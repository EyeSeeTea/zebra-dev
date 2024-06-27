import React from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Separator } from "../separator/Separator";

type SectionProps = {
    title?: string;
    lastUpdated?: string;
    children: React.ReactNode;
    headerButtom?: React.ReactNode;
    hasSeparator?: boolean;
    titleVariant?: "primary" | "secondary";
};

export const Section: React.FC<SectionProps> = React.memo(
    ({
        title = "",
        lastUpdated = "",
        headerButtom,
        hasSeparator = false,
        children,
        titleVariant = "primary",
    }) => {
        return (
            <SectionContainer $hasSeparator={hasSeparator}>
                {hasSeparator && <Separator />}
                <Header>
                    <TitleContainer>
                        {title ? <Title $titleVariant={titleVariant}>{title}</Title> : null}
                        {lastUpdated ? (
                            <LastUpdatedContainer>
                                <LastUpdatedTitle>
                                    {i18n.t("Last updated: ", { nsSeparator: false })}
                                </LastUpdatedTitle>
                                {lastUpdated}
                            </LastUpdatedContainer>
                        ) : null}
                    </TitleContainer>
                    {headerButtom ? <div>{headerButtom}</div> : null}
                </Header>
                <Content>{children}</Content>
            </SectionContainer>
        );
    }
);

const SectionContainer = styled.section<{ $hasSeparator?: boolean }>`
    width: 100%;
    margin-block-end: ${props => (props.$hasSeparator ? "0" : "24px")};
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.span<{ $titleVariant: string }>`
    color: ${props =>
        props.$titleVariant === "secondary"
            ? props.theme.palette.common.grey800
            : props.theme.palette.common.black};
    font-size: 1.25rem;
    font-weight: 400;
`;

const LastUpdatedContainer = styled.div`
    display: flex;
    gap: 4px;
    color: ${props => props.theme.palette.common.grey600};
    font-size: 0.875rem;
    font-weight: 400;
    margin-block-start: 12px;
`;

const LastUpdatedTitle = styled.span`
    color: ${props => props.theme.palette.common.grey600};
    font-size: 0.875rem;
    font-weight: 700;
`;

const Content = styled.div`
    margin-block-start: 20px;
`;
