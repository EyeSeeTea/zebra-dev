import React from "react";
import styled from "styled-components";

import {
    IMTeamHierarchyOption,
    IMTeamHierarchyView,
} from "../im-team-hierarchy/IMTeamHierarchyView";
import { Id } from "../../../domain/entities/Ref";
import { BasicTable, TableColumn, TableRowType } from "../table/BasicTable";

type IncidentManagementTeamViewProps = {
    selectedHierarchyItemIds?: Id[];
    onSelectHierarchyItem?: (nodeId: string, selected: boolean) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    incidentManagementTeamHierarchyItems: IMTeamHierarchyOption[];
    defaultTeamRolesExpanded: Id[];
    diseaseOutbreakEventName: string;
    isSelectable?: boolean;
    constactTableColumns: TableColumn[];
    constactTableRows: TableRowType[];
};

export const IncidentManagementTeamView: React.FC<IncidentManagementTeamViewProps> = React.memo(
    props => {
        const {
            selectedHierarchyItemIds,
            onSelectHierarchyItem,
            searchTerm,
            onSearchChange,
            incidentManagementTeamHierarchyItems,
            defaultTeamRolesExpanded,
            diseaseOutbreakEventName,
            constactTableColumns,
            constactTableRows,
            isSelectable = false,
        } = props;

        return (
            <IncidentManagementTeamViewContainer>
                <IMTeamHierarchyView
                    items={incidentManagementTeamHierarchyItems}
                    selectedItemIds={selectedHierarchyItemIds}
                    onSelectedItemChange={onSelectHierarchyItem}
                    diseaseOutbreakEventName={diseaseOutbreakEventName}
                    onSearchChange={onSearchChange}
                    searchTerm={searchTerm}
                    defaultTeamRolesExpanded={defaultTeamRolesExpanded}
                    isSelectable={isSelectable}
                />
                <BasicTable columns={constactTableColumns} rows={constactTableRows} />
            </IncidentManagementTeamViewContainer>
        );
    }
);

const IncidentManagementTeamViewContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;
