import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { PerformanceOverviewTable } from "../../components/table/performance-overview-table/PerformanceOverviewTable";

export const DashboardPage: React.FC = React.memo(() => {
    const dataPerformanceOverview = [
        {
            event: "Cholera",
            location: "Northern",
            cases: "62",
            deaths: "34",
            duration: "4d",
            manager: "Paul Zulu",
            detect7d: "2",
            notify1d: "1",
            era1: "1",
            era2: "",
            era3: "",
            era4: "",
            era5: "",
            era6: "",
            era7: "",
            eri: "",
            respond7d: "",
        },
        {
            event: "Measles",
            location: "Western",
            cases: "112",
            deaths: "32",
            duration: "19d",
            manager: "Moses Mei",
            detect7d: "12",
            notify1d: "1",
            era1: "1",
            era2: "3",
            era3: "6",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Rabies",
            location: "Central",
            cases: "39",
            deaths: "12",
            duration: "13d",
            manager: "Tristin Go",
            detect7d: "6",
            notify1d: "3",
            era1: "6",
            era2: "7",
            era3: "7",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Polio",
            location: "Copperbelt",
            cases: "10",
            deaths: "3",
            duration: "18d",
            manager: "Lillie Lee",
            detect7d: "10",
            notify1d: "3",
            era1: "4",
            era2: "10",
            era3: "9",
            era4: "12",
            era5: "12",
            era6: "5",
            era7: "7",
            eri: "7",
            respond7d: "12",
        },
        {
            event: "Covid-19",
            location: "Lusaka",
            cases: "64",
            deaths: "32",
            duration: "14d",
            manager: "Jed Selma",
            detect7d: "7",
            notify1d: "1",
            era1: "1",
            era2: "7",
            era3: "7",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Covid-19",
            location: "North Western",
            cases: "64",
            deaths: "32",
            duration: "13d",
            manager: "Meg Amy",
            detect7d: "6",
            notify1d: "3",
            era1: "6",
            era2: "7",
            era3: "7",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Cholera",
            location: "Eastern",
            cases: "10",
            deaths: "3",
            duration: "17d",
            manager: "Mary Cole",
            detect7d: "10",
            notify1d: "3",
            era1: "4",
            era2: "10",
            era3: "9",
            era4: "12",
            era5: "12",
            era6: "5",
            era7: "7",
            eri: "7",
            respond7d: "12",
        },
    ];

    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section>
            <Section title={i18n.t("All public health events")}>
                All public health events content
            </Section>
            <Section title={i18n.t("7-1-7 performance")}>7-1-7 performance content</Section>
            <Section title={i18n.t("Performance overview")}>
                <PerformanceOverviewTable rows={dataPerformanceOverview} />
            </Section>
        </Layout>
    );
});
