import { TreeItem as TreeItemMUI } from "@material-ui/lab";
import React from "react";
import styled from "styled-components";
import { IconUser24 } from "@dhis2/ui";

import { Maybe } from "../../../utils/ts-utils";
import { Checkbox } from "../checkbox/Checkbox";
import { TeamMember } from "../../../domain/entities/incident-management-team/TeamMember";
import { TeamMemberProfile } from "./TeamMemberProfile";
import { IMTeamHierarchyOption } from "./IMTeamHierarchyView";
import { Id } from "../../../domain/entities/Ref";

type IMTeamHierarchyItemProps = {
    nodeId: string;
    teamRole: string;
    member: Maybe<TeamMember>;
    disabled?: boolean;
    onSelectedChange: (nodeId: string, selected: boolean) => void;
    subChildren: IMTeamHierarchyOption[];
    diseaseOutbreakEventName: string;
    selectedItemId: Id;
};

export const IMTeamHierarchyItem: React.FC<IMTeamHierarchyItemProps> = React.memo(props => {
    const {
        nodeId,
        teamRole,
        member,
        disabled = false,
        onSelectedChange,
        subChildren,
        diseaseOutbreakEventName,
        selectedItemId,
    } = props;

    const [openMemberProfile, setOpenMemberProfile] = React.useState(false);

    const onCheckboxChange = React.useCallback(
        (isChecked: boolean) => {
            !disabled && onSelectedChange(nodeId, isChecked);
        },
        [disabled, nodeId, onSelectedChange]
    );

    const onTeamRoleClick = React.useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            event.preventDefault();
            !disabled && onSelectedChange(nodeId, !(selectedItemId === nodeId));
        },
        [disabled, nodeId, onSelectedChange, selectedItemId]
    );

    const onMemberClick = React.useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            if (member) {
                event.preventDefault();
                setOpenMemberProfile(true);
            }
        },
        [member]
    );

    return (
        <>
            <StyledIMTeamHierarchyItem
                nodeId={nodeId}
                aria-disabled={disabled}
                label={
                    <LabelWrapper>
                        <Checkbox
                            id={`team-role-hierarchy-checkbox-${nodeId}`}
                            checked={selectedItemId === nodeId}
                            onChange={onCheckboxChange}
                            disabled={disabled}
                        />

                        <RoleAndMemberWrapper>
                            <IconUser24 color="#4A5768" />

                            <RoleWrapper onClick={onTeamRoleClick}>{teamRole}:</RoleWrapper>

                            <MemberWrapper onClick={onMemberClick}>
                                {member ? member.name : "TBD"}
                            </MemberWrapper>
                        </RoleAndMemberWrapper>
                    </LabelWrapper>
                }
            >
                {subChildren.map(child => (
                    <IMTeamHierarchyItem
                        key={child.id}
                        nodeId={child.id}
                        teamRole={child.teamRole}
                        member={child.member}
                        selectedItemId={selectedItemId}
                        onSelectedChange={onSelectedChange}
                        diseaseOutbreakEventName={diseaseOutbreakEventName}
                        subChildren={child.children}
                    />
                ))}
            </StyledIMTeamHierarchyItem>

            {member && (
                <TeamMemberProfile
                    open={openMemberProfile}
                    setOpen={setOpenMemberProfile}
                    member={member}
                    diseaseOutbreakEventName={diseaseOutbreakEventName}
                />
            )}
        </>
    );
});

const StyledIMTeamHierarchyItem = styled(TreeItemMUI)`
    .MuiTreeItem-label {
        padding-left: 0;
        height: 30px;
        span.MuiButtonBase-root.MuiCheckbox-root {
            padding: 9px 2px;
        }
    }
`;

const LabelWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const RoleAndMemberWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    svg {
        color: ${props => props.theme.palette.common.grey700};
        height: 20px;
        width: 20px;
    }
`;

const RoleWrapper = styled.div`
    font-weight: 700;
    font-size: 0.875rem;
    color: ${props => props.theme.palette.common.grey900};
`;

const MemberWrapper = styled.div`
    font-weight: 400;
    font-size: 0.875rem;
    text-decoration: underline;
    color: ${props => props.theme.palette.common.blue800};
`;
