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
import { IMTeamHierarchyView } from "../../components/im-team-hierarchy/IMTeamHierarchyView";
import { useIMTeamBuilder } from "./useIMTeamBuilder";
import { useCurrentEventTracker } from "../../contexts/current-event-tracker-context";
import { SimpleModal } from "../../components/simple-modal/SimpleModal";

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
        selectedHierarchyItemId,
        openDeleteModalData,
        disableDeletion,
        searchTerm,
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
            <LoaderContainer loading={!incidentManagementTeamHierarchyItems}>
                <UserCardContainer>
                    {incidentManagerUser && <UserCard selectedUser={incidentManagerUser} />}
                </UserCardContainer>

                <Section
                    lastUpdated={lastUpdated}
                    headerButton={
                        <ButtonsContainer>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={
                                    selectedHierarchyItemId ? <IconEditItems24 /> : <IconUser24 />
                                }
                                onClick={goToIncidentManagementTeamRole}
                            >
                                {selectedHierarchyItemId
                                    ? i18n.t("Edit Role")
                                    : i18n.t("Assign Role")}
                            </Button>

                            {selectedHierarchyItemId && (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    disabled={disableDeletion}
                                    startIcon={<DeleteOutline />}
                                    onClick={() => onOpenDeleteModalData(selectedHierarchyItemId)}
                                >
                                    {i18n.t("Delete Role")}
                                </Button>
                            )}
                        </ButtonsContainer>
                    }
                >
                    <IMTeamHierarchyView
                        items={incidentManagementTeamHierarchyItems || []}
                        selectedItemId={selectedHierarchyItemId}
                        onSelectedItemChange={onSelectHierarchyItem}
                        diseaseOutbreakEventName={getCurrentEventTracker()?.name || ""}
                        onSearchChange={onSearchChange}
                        searchTerm={searchTerm}
                    />

                    <SimpleModal
                        open={!!openDeleteModalData}
                        onClose={() => onOpenDeleteModalData(undefined)}
                        title={i18n.t("Delete team role")}
                        closeLabel={i18n.t("Cancel")}
                        footerButtons={
                            <Button onClick={onDeleteIncidentManagementTeamMember}>
                                {i18n.t("Delete Role")}
                            </Button>
                        }
                    >
                        {openDeleteModalData && (
                            <RoleAndMemberWrapper>
                                <RoleWrapper>{openDeleteModalData.teamRole.name}: </RoleWrapper>
                                <MemberWrapper>
                                    {openDeleteModalData.teamMember.name}{" "}
                                </MemberWrapper>
                            </RoleAndMemberWrapper>
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

const RoleAndMemberWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const RoleWrapper = styled.div`
    font-weight: 700;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;

const MemberWrapper = styled.div`
    font-weight: 400;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;
