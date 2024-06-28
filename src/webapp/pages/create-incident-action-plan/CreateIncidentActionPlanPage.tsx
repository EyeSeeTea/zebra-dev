import React from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { BasicTable, TableColumn } from "../../components/table/BasicTable";
import { Section } from "../../components/section/Section";

export const CreateIncidentActionPlanPage: React.FC = React.memo(() => {
    const columnsTeam: TableColumn[] = [
        { value: "role", label: "Role" },
        { value: "name", label: "Name", type: "link" },
        { value: "email", label: "Email", type: "link" },
        { value: "phone", label: "Phone" },
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
        { value: "mainTask", label: "Main Task", underline: true },
        { value: "subActivities", label: "Sub Activities" },
        { value: "subPillar", label: "Sub Pillar" },
        { value: "responsibleOfficer", label: "Responsible officer" },
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
        { value: "timeline", label: "Timeline" },
        { value: "dueDate", label: "Due date" },
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
            hideSideBarOptions
        >
            CreateIncidentActionPlanPage
            <Section title={i18n.t("Team")}>
                <BasicTable
                    columns={columnsTeam}
                    rows={dataTeam}
                    onChange={(...arg) => console.log(arg)}
                />
            </Section>
            <Section title={i18n.t("Response Actions")}>
                <BasicTable
                    showRowIndex
                    columns={columnsResponseActions}
                    rows={dataResponseActions}
                    onChange={(...arg) => console.log(arg)}
                />
            </Section>
        </Layout>
    );
});
