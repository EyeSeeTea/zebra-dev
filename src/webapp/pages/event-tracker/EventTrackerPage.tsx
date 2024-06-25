import React from "react";
import { IconEdit24 } from "@dhis2/ui";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { Button } from "../../components/button/Button";
import { RiskAssessmentSection } from "./RiskAssessmentSection";

export const EventTrackerPage: React.FC = React.memo(() => {
    return (
        <Layout title={i18n.t("Event Tracker")}>
            <Section
                title={"Event details, event date"}
                titleVariant="secondary"
                headerButtom={
                    <Button
                        onClick={function (): void {
                            throw new Error("Function not implemented.");
                        }}
                        variant="outlined"
                        color="secondary"
                        startIcon={<IconEdit24 />}
                    >
                        {i18n.t("Edit Details")}
                    </Button>
                }
                hasSeparator
            >
                Event details
            </Section>
            <Section title={i18n.t("Districts affected")} hasSeparator>
                Districts affected content
            </Section>
            <RiskAssessmentSection />
            <Section title={i18n.t("Overview")} lastUpdated="last updated date" hasSeparator>
                Overview content
            </Section>
            <Section hasSeparator>Cases content</Section>
            <Section title={i18n.t("7-1-7 performance")} hasSeparator>
                7-1-7 performance content
            </Section>
        </Layout>
    );
});
