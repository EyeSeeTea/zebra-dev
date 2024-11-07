import React, { useEffect } from "react";
import styled from "styled-components";
import { IconUser24, IconEditItems24 } from "@dhis2/ui";
import { useParams } from "react-router-dom";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { DeleteOutline } from "@material-ui/icons";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import LoaderContainer from "../../components/loader/LoaderContainer";
import { UserCard } from "../../components/user-selector/UserCard";
import { Section } from "../../components/section/Section";
import { Button } from "../../components/button/Button";
import { useIMTeamBuilder } from "./useIMTeamBuilder";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { SimpleModal } from "../../components/simple-modal/SimpleModal";
import { IncidentManagementTeamView } from "../../components/incident-management-team/IncidentManagementTeamView";

export const IMTeamBuilderPage: React.FC = React.memo(() => {
    const { id } = useParams<{
        id: string;
    }>();
    const snackbar = useSnackbar();
    const { getCurrentEventTracker } = useCurrentEventTracker();
    const {
        globalMessage,
        incidentManagerUser,
        lastUpdated,
        incidentManagementTeamHierarchyItems,
        selectedHierarchyItemIds,
        openDeleteModalData,
        disableDeletion,
        searchTerm,
        defaultTeamRolesExpanded,
        constactTableColumns,
        constactTableRows,
        onSearchChange,
        onSelectHierarchyItem,
        goToIncidentManagementTeamRole,
        onDeleteIncidentManagementTeamMember,
        onOpenDeleteModalData,
    } = useIMTeamBuilder(id);

    useEffect(() => {
        if (!globalMessage) return;

        snackbar[globalMessage.type](globalMessage.text);
    }, [globalMessage, snackbar]);

    return (
        <Layout
            title={i18n.t("Incident Management Team Builder")}
            subtitle={getCurrentEventTracker()?.name || ""}
        >
            <LoaderContainer
                loading={!incidentManagementTeamHierarchyItems || !defaultTeamRolesExpanded}
            >
                <UserCardContainer>
                    {incidentManagerUser && <UserCard selectedUser={incidentManagerUser} />}
                </UserCardContainer>

                <Section
                    lastUpdated={lastUpdated}
                    headerButton={
                        <ButtonsContainer>
                            {selectedHierarchyItemIds.length > 1 ? null : (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={
                                        selectedHierarchyItemIds.length === 1 &&
                                        selectedHierarchyItemIds[0] ? (
                                            <IconEditItems24 />
                                        ) : (
                                            <IconUser24 />
                                        )
                                    }
                                    onClick={goToIncidentManagementTeamRole}
                                >
                                    {selectedHierarchyItemIds.length === 1 &&
                                    selectedHierarchyItemIds[0]
                                        ? i18n.t("Edit Role")
                                        : i18n.t("Assign Role")}
                                </Button>
                            )}

                            {selectedHierarchyItemIds.length ? (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    disabled={disableDeletion}
                                    startIcon={<DeleteOutline />}
                                    onClick={() => onOpenDeleteModalData(selectedHierarchyItemIds)}
                                >
                                    {selectedHierarchyItemIds.length > 1
                                        ? i18n.t("Delete Roles")
                                        : i18n.t("Delete Role")}
                                </Button>
                            ) : null}
                        </ButtonsContainer>
                    }
                >
                    {!incidentManagementTeamHierarchyItems || !defaultTeamRolesExpanded ? null : (
                        <IncidentManagementTeamView
                            incidentManagementTeamHierarchyItems={
                                incidentManagementTeamHierarchyItems
                            }
                            selectedHierarchyItemIds={selectedHierarchyItemIds}
                            onSelectHierarchyItem={onSelectHierarchyItem}
                            onSearchChange={onSearchChange}
                            searchTerm={searchTerm}
                            defaultTeamRolesExpanded={defaultTeamRolesExpanded}
                            diseaseOutbreakEventName={getCurrentEventTracker()?.name || ""}
                            constactTableColumns={constactTableColumns}
                            constactTableRows={constactTableRows}
                            isSelectable={true}
                        />
                    )}

                    <SimpleModal
                        open={!!openDeleteModalData}
                        onClose={() => onOpenDeleteModalData(undefined)}
                        title={i18n.t("Confirm deletion")}
                        closeLabel={i18n.t("Cancel")}
                        footerButtons={
                            <Button onClick={onDeleteIncidentManagementTeamMember}>
                                {i18n.t("Delete")}
                            </Button>
                        }
                    >
                        {openDeleteModalData && (
                            <Text>
                                {i18n.t(
                                    `Are you sure you want to delete ${
                                        openDeleteModalData.length > 1
                                            ? "these team roles"
                                            : "this team role"
                                    }?`
                                )}
                            </Text>
                        )}
                    </SimpleModal>
                </Section>
            </LoaderContainer>
        </Layout>
    );
});

const UserCardContainer = styled.div`
    width: fit-content;
    margin-block-end: 48px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 8px;
`;

const Text = styled.div`
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;
