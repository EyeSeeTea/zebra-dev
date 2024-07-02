import React from "react";
import { IconEdit24 } from "@dhis2/ui";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { Button } from "../../components/button/Button";
import { BasicTable, TableColumn } from "../../components/table/BasicTable";

export const IncidentActionPlanPage: React.FC = React.memo(() => {
    const columnsTeam: TableColumn[] = [
        { value: "role", label: "Role", type: "text" },
        { value: "name", label: "Name", type: "link" },
        { value: "email", label: "Email", type: "link" },
        { value: "phone", label: "Phone", type: "text" },
    ];

    const dataTeam = [
        {
            role: "Incident Manager",
            name: "George Abitbol",
            email: "george.abitbol@gmail.com",
            phone: "+33 6 12 34 56 78",
        },
        {
            role: "Manager of Operations",
            name: "John Traore",
            email: "george.abitbol@gmail.com",
            phone: "+33 6 12 34 56 78",
        },
    ];

    const columnsResponseActions: TableColumn[] = [
        { value: "mainTask", label: "Main Task", type: "text", underline: true },
        { value: "subActivities", label: "Sub Activities", type: "text" },
        { value: "subPillar", label: "Sub Pillar", type: "text" },
        { value: "responsibleOfficer", label: "Responsible officer", type: "text" },
        {
            value: "status",
            label: "Status",
            type: "selector",
            options: [
                { value: "Complete", label: "Complete" },
                { value: "Pending", label: "Pending" },
                { value: "In progress", label: "In progress" },
            ],
        },
        {
            value: "verification",
            label: "Verification",
            type: "selector",
            options: [
                { value: "Unverified", label: "Unverified" },
                { value: "Verified", label: "Verified" },
            ],
        },
        { value: "timeline", label: "Timeline", type: "text" },
        { value: "dueDate", label: "Due date", type: "text" },
    ];

    const dataResponseActions = [
        {
            mainTask: "Data management",
            subActivities: "Configure tablet",
            subPillar: "Planning",
            responsibleOfficer: "Moses Banda",
            status: "Complete",
            verification: "Unverified",
            timeline: "Qtr 2 June",
            dueDate: "8 June",
        },
        {
            mainTask: "Risk communication",
            subActivities: "Develop risk communication plan",
            subPillar: "RCCE",
            responsibleOfficer: "Mr Zimba",
            status: "Pending",
            verification: "Verified",
            timeline: "Qtr 3 June",
            dueDate: "17 June",
        },
        {
            mainTask: "Vaccine transportation",
            subActivities: "Reverse cold storage transport",
            subPillar: "Logistics",
            responsibleOfficer: "Mr Guissimon",
            status: "In progress",
            verification: "Unverified",
            timeline: "Qtr 3 June",
            dueDate: "9 June",
        },
        {
            mainTask: "Training of RRT",
            subActivities: "Train and deploy RRTs",
            subPillar: "Operations",
            responsibleOfficer: "Dr Chika",
            status: "Not done",
            verification: "Unverified",
            timeline: "Qtr 3 June",
            dueDate: "9 June",
        },
        {
            mainTask: "Supplies",
            subActivities: "Procure granular chlorine",
            subPillar: "Administration",
            responsibleOfficer: "Moses Banda",
            status: "Pending",
            verification: "Unverified",
            timeline: "Qtr 4 June",
            dueDate: "20 June",
        },
        {
            mainTask: "Supplies",
            subActivities: "Procure RDTs",
            subPillar: "Operations",
            responsibleOfficer: "Mpanga Kasonde",
            status: "In Progress",
            verification: "Unverified",
            timeline: "Qtr 3 June",
            dueDate: "17 June",
        },
        {
            mainTask: "Strengthen surveillance",
            subActivities: "Active case search",
            subPillar: "Surveillance",
            responsibleOfficer: "Namonda Mbumwae",
            status: "Complete",
            verification: "Unverified",
            timeline: "Qtr 1 June",
            dueDate: "5 June",
        },
    ];

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
                <BasicTable
                    showRowIndex
                    columns={columnsResponseActions}
                    rows={dataResponseActions}
                    onChange={(...arg) => console.log(arg)}
                />
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
                <BasicTable
                    columns={columnsTeam}
                    rows={dataTeam}
                    onChange={(...arg) => console.log(arg)}
                />
            </Section>
        </Layout>
    );
});
