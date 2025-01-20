import React from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { RiskAssessmentSummary } from "../../../domain/entities/risk-assessment/RiskAssessmentSummary";
import { getDateAsMonthYearString } from "../../../data/repositories/utils/DateTimeHelper";

export type RiskAssessmentSummaryProps = {
    riskAssessmentSummary: RiskAssessmentSummary;
};

export const RiskAssessmentSummaryInfo: React.FC<RiskAssessmentSummaryProps> = React.memo(props => {
    const { riskAssessmentSummary } = props;

    return (
        <SummaryContainer>
            <SummaryWrapper>
                <SummaryContent $direction="column">
                    <TextBold>{i18n.t("Overall Risk")}</TextBold>
                    <Text>
                        {i18n.t("National:", { nsSeparator: false })}{" "}
                        {riskAssessmentSummary.overallRiskNational.name}
                    </Text>
                    <Text>
                        {i18n.t("Regional:", { nsSeparator: false })}{" "}
                        {riskAssessmentSummary.overallRiskRegional.name}
                    </Text>
                    <Text>
                        {i18n.t("Global:", { nsSeparator: false })}{" "}
                        {riskAssessmentSummary.overallRiskGlobal.name}
                    </Text>
                </SummaryContent>
                <SummaryContent $direction="column">
                    <TextBold>{i18n.t("Overall Confidence")}</TextBold>
                    <Text>
                        {i18n.t("National:", { nsSeparator: false })}{" "}
                        {riskAssessmentSummary.overallConfidenceNational.name}
                    </Text>
                    <Text>
                        {i18n.t("Regional:", { nsSeparator: false })}{" "}
                        {riskAssessmentSummary.overallConfidenceRegional.name}
                    </Text>
                    <Text>
                        {i18n.t("Global:", { nsSeparator: false })}{" "}
                        {riskAssessmentSummary.overallConfidenceGlobal.name}
                    </Text>
                </SummaryContent>
            </SummaryWrapper>
            <SummaryWrapper>
                <SummaryContent>
                    <TextBold>{i18n.t("Risk Assessment Date: ", { nsSeparator: false })}</TextBold>
                    <Text>
                        {getDateAsMonthYearString(riskAssessmentSummary.riskAssessmentDate)}
                    </Text>
                </SummaryContent>
            </SummaryWrapper>
        </SummaryContainer>
    );
});

const SummaryContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const SummaryWrapper = styled.div`
    display: flex;
    gap: 80px;
`;

const SummaryContent = styled.div<{ $direction?: string }>`
    display: flex;
    flex-direction: ${props => props.$direction || "row"};
    gap: 5px;
`;

const TextBold = styled.span`
    font-weight: bold;
    color: ${props => props.theme.palette.common.grey700};
`;

const Text = styled.span`
    color: ${props => props.theme.palette.common.grey700};
`;
