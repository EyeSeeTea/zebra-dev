import React from "react";
import { VisualizationTypes } from "../../pages/event-tracker/EventTrackerPage";
import styled from "styled-components";
import { Section } from "../section/Section";

type VisualisationProps = {
    type: VisualizationTypes;
    title: string;
    hasSeparator?: boolean;
    lastUpdated?: string;
};
export const Visualisation: React.FC<VisualisationProps> = React.memo(props => {
    const { title, hasSeparator, lastUpdated } = props;
    return (
        <Section
            title={title}
            hasSeparator={hasSeparator}
            titleVariant="secondary"
            lastUpdated={lastUpdated}
        >
            <VisualisationContainer>{`Coming soon!`}</VisualisationContainer>
        </Section>
    );
});

const VisualisationContainer = styled.div`
    width: 100%;
    height: 25rem;
    border: 0.1rem solid black;
    background: ${props => props.theme.palette.primary.contrastText};
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
`;
