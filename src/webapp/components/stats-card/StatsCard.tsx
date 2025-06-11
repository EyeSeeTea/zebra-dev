import React from "react";
import { CardContent, Card, CardActionArea } from "@material-ui/core";
import styled from "styled-components";

export type StatsCardProps = {
    color?: "normal" | "green" | "red" | "grey";
    stat: string;
    pretitle?: string;
    title: string;
    subtitle?: string;
    isPercentage?: boolean;
    error?: boolean;
    fillParent?: boolean;
    onClick?: () => void;
};

export const StatsCard: React.FC<StatsCardProps> = React.memo(
    ({
        stat,
        title,
        subtitle,
        pretitle,
        color = "normal",
        isPercentage = false,
        error = false,
        fillParent = false,
        onClick,
    }) => {
        const StatsCardContent = () => {
            return (
                <StyledCardContent onClick={onClick}>
                    <Stat color={color}>{isPercentage ? formatPercent(stat) : stat}</Stat>

                    <PreTitle>{pretitle}</PreTitle>

                    <Title>{title}</Title>

                    <SubTitle>{subtitle}</SubTitle>
                </StyledCardContent>
            );
        };

        return (
            <StyledCard $error={error} $fillParent={fillParent}>
                {onClick ? (
                    <StyledCardActionArea>
                        <StatsCardContent />
                    </StyledCardActionArea>
                ) : (
                    <StatsCardContent />
                )}
            </StyledCard>
        );
    }
);

function formatPercent(value: string): string {
    return `${!isNaN(Number(value)) ? Number(value).toFixed(2) : value}%`;
}

const StyledCard = styled(Card)<{ $error?: boolean; $fillParent?: boolean }>`
    width: ${props => (props.$fillParent ? "100%" : "fit-content")};
    min-width: 220px;
    max-width: 300px;
    border-style: ${props => (props.$error ? "solid" : "none")};
    border-width: ${props => (props.$error ? "1px" : "0")};
    border-color: ${props => (props.$error ? props.theme.palette.stats.red : "unset")};
`;

const StyledCardActionArea = styled(CardActionArea)<{ $clickable?: boolean }>`
    height: 100%;
`;

const StyledCardContent = styled(CardContent)`
    padding-inline: 66px;
    padding-block: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

const Stat = styled.div<{ color: string }>`
    color: ${props => props.theme.palette.stats[props.color]};
    font-size: 2em;
    font-weight: 400;
`;

const PreTitle = styled.span`
    color: ${props => props.theme.palette.stats.pretitle};
    font-weight: 400;
    font-size: 0.875rem;
    text-align: center;
`;

const Title = styled.span`
    color: ${props => props.theme.palette.stats.title};
    font-weight: 700;
    font-size: 1rem;
    text-align: center;
`;

const SubTitle = styled.span`
    color: ${props => props.theme.palette.stats.subtitle};
    font-weight: 400;
    font-size: 0.875rem;
    text-align: center;
`;
