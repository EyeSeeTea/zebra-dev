import React from "react";

import { Layout } from "../../components/layout/Layout";
import i18n from "../../../utils/i18n";
import { BasicTable, TableColumn } from "../../components/table/BasicTable";
import { Section } from "../../components/section/Section";

export const CreateIncidentActionPlanPage: React.FC = React.memo(() => {
    const columnsTeam: TableColumn[] = [
        { name: "role" },
        { name: "name", type: "link" },
        { name: "email", type: "link" },
        { name: "phone" },
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
        { name: "mainTask" },
        { name: "subActivities" },
        { name: "subPillar" },
        { name: "responsibleOfficer" },
        {
            name: "status",
            type: "selector",
            options: [
                { value: "Complete", label: "Complete" },
                { value: "Pending", label: "Pending" },
                { value: "In progress", label: "In progress" },
            ],
        },
        {
            name: "verification",
            type: "selector",
            options: [
                { value: "Unverified", label: "Unverified" },
                { value: "Verified", label: "Verified" },
            ],
        },
        { name: "timeline" },
        { name: "dueDate" },
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
