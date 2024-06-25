import React from "react";
import { IconEdit24 } from "@dhis2/ui";

import i18n from "../../../utils/i18n";
import { Section } from "../../components/section/Section";
import { Button } from "../../components/button/Button";
import { NoticeBox } from "../../components/notice-box/NoticeBox";

export const RiskAssessmentSection: React.FC = React.memo(() => {
    return (
        <Section
            title={i18n.t("Risk Assessment")}
            headerButtom={
                <Button
                    onClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    startIcon={<IconEdit24 />}
                >
                    {i18n.t("Create Risk Assessment")}
                </Button>
            }
            hasSeparator
        >
            <NoticeBox title={i18n.t("Risk assessment incomplete")}>
                <div>{i18n.t("Risks associated with this event have not yet been assessed.")}</div>
            </NoticeBox>
        </Section>
    );
});
