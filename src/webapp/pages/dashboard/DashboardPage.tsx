import React from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Button } from "../../components/button/Button";

// TODO: Add every section here, first it's just an example

export const DashboardPage: React.FC = React.memo(() => {
    const { goTo } = useRoutes();

    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <ExampleContainer>
                <Button onClick={() => goTo(RouteName.RESOURCES)}>Check components</Button>
            </ExampleContainer>
            <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section>
        </Layout>
    );
});

const ExampleContainer = styled.div`
    margin-block-end: 50px;
`;
