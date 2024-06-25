import React from "react";
import { IconEdit24 } from "@dhis2/ui";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { Button } from "../../components/button/Button";

export const IncidentActionPlanPage: React.FC = React.memo(() => {
    return (
        <Layout
            title={i18n.t("Incident Action Plan")}
            subtitle={i18n.t("Cholera in NW Province, June 2023")}
        >
            <Section>IAP details</Section>
            <Section
                title={i18n.t("Response actions")}
                headerButtom={
                    <Button
                        onClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        variant="outlined"
                        color="secondary"
                        startIcon={<IconEdit24 />}
                    >
                        {i18n.t("Edit Response Actions")}
                    </Button>
                }
            >
                Response actions content
            </Section>
            <Section
                title={i18n.t("Action plan")}
                headerButtom={
                    <Button
                        onClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        variant="outlined"
                        color="secondary"
                        startIcon={<IconEdit24 />}
                    >
                        {i18n.t("Edit Action Plan")}
                    </Button>
                }
            >
                Action plan content
            </Section>
            <Section
                title={i18n.t("Team")}
                headerButtom={
                    <Button
                        onClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        variant="outlined"
                        color="secondary"
                        startIcon={<IconEdit24 />}
                    >
                        {i18n.t("Edit Team")}
                    </Button>
                }
            >
                Team content
            </Section>
        </Layout>
    );
});
