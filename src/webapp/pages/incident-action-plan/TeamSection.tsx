import React, { useCallback } from "react";
import { IconEditItems24 } from "@dhis2/ui";

import i18n from "../../../utils/i18n";
import { Section } from "../../components/section/Section";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Button } from "../../components/button/Button";
import { useIncidentManagementTeamView } from "../../components/incident-management-team/useIncidentManagementTeamView";
import { Id } from "../../../domain/entities/Ref";
import { IncidentManagementTeamView } from "../../components/incident-management-team/IncidentManagementTeamView";

type TeamSectionProps = {
    diseaseOutbreakEventId: Id;
};

export const TeamSection: React.FC<TeamSectionProps> = React.memo(props => {
    const { diseaseOutbreakEventId } = props;
    const { goTo } = useRoutes();
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const {
        incidentManagementTeamHierarchyItems,
        onSearchChange,
        searchTerm,
        defaultTeamRolesExpanded,
        constactTableColumns,
        constactTableRows,
    } = useIncidentManagementTeamView(diseaseOutbreakEventId);

    const goToIncidentManagementTeamBuilder = useCallback(() => {
        goTo(RouteName.IM_TEAM_BUILDER, { id: diseaseOutbreakEventId });
    }, [diseaseOutbreakEventId, goTo]);

    return (
        <Section
            title={i18n.t("Team")}
            hasSeparator={true}
            headerButton={
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<IconEditItems24 />}
                    onClick={goToIncidentManagementTeamBuilder}
                >
                    {i18n.t("Edit Team")}
                </Button>
            }
            titleVariant="secondary"
        >
            {!incidentManagementTeamHierarchyItems || !defaultTeamRolesExpanded ? null : (
                <IncidentManagementTeamView
                    incidentManagementTeamHierarchyItems={incidentManagementTeamHierarchyItems}
                    onSearchChange={onSearchChange}
                    searchTerm={searchTerm}
                    defaultTeamRolesExpanded={defaultTeamRolesExpanded}
                    diseaseOutbreakEventName={getCurrentEventTracker()?.name || ""}
                    constactTableColumns={constactTableColumns}
                    constactTableRows={constactTableRows}
                />
            )}
        </Section>
    );
});
