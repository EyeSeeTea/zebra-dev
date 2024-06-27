import React from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { PerformanceOverviewTable } from "../../components/table/performance-overview-table/PerformanceOverviewTable";

export const DashboardPage: React.FC = React.memo(() => {
    const dataPerformanceOverview = [
        {
            event: { value: "Cholera" },
            location: { value: "Northern" },
            cases: { value: "62" },
            deaths: { value: "34" },
            duration: { value: "4d" },
            manager: { value: "Paul Zulu" },
            detect7d: { value: "2", color: "green" },
            notify1d: { value: "1", color: "green" },
            era1: { value: "1" },
            era2: { color: "orange" },
            era3: { value: "", color: "orange" },
            era4: { value: "", color: "orange" },
            era5: { value: "", color: "orange" },
            era6: { value: "", color: "orange" },
            era7: { value: "", color: "orange" },
            eri: { value: "", color: "orange" },
            respond7d: { value: "7", color: "green" },
        },
        {
            event: { value: "Measles" },
            location: { value: "Western" },
            cases: { value: "112" },
            deaths: { value: "32" },
            duration: { value: "19d" },
            manager: { value: "Moses Mei" },
            detect7d: { value: "12", color: "red" },
            notify1d: { value: "1", color: "green" },
            era1: { value: "1" },
            era2: { value: "3" },
            era3: { value: "6" },
            era4: { value: "7" },
            era5: { value: "7" },
            era6: { value: "7" },
            era7: { value: "7" },
            eri: { value: "7" },
            respond7d: { value: "7", color: "green" },
        },
        {
            event: { value: "Rabies" },
            location: { value: "Central" },
            cases: { value: "39" },
            deaths: { value: "12" },
            duration: { value: "13d" },
            manager: { value: "Tristin Go" },
            detect7d: { value: "6", color: "green" },
            notify1d: { value: "3", color: "red" },
            era1: { value: "6" },
            era2: { value: "7" },
            era3: { value: "7" },
            era4: { value: "7" },
            era5: { value: "7" },
            era6: { value: "7" },
            era7: { value: "7" },
            eri: { value: "7" },
            respond7d: { value: "7", color: "green" },
        },
        {
            event: { value: "Polio" },
            location: { value: "Copperbelt" },
            cases: { value: "10" },
            deaths: { value: "3" },
            duration: { value: "18d" },
            manager: { value: "Lillie Lee" },
            detect7d: { value: "10", color: "red" },
            notify1d: { value: "3", color: "red" },
            era1: { value: "4", color: "red" },
            era2: { value: "10", color: "red" },
            era3: { value: "9", color: "red" },
            era4: { value: "12", color: "red" },
            era5: { value: "12", color: "red" },
            era6: { value: "5", color: "red" },
            era7: { value: "7" },
            eri: { value: "7" },
            respond7d: { value: "12", color: "red" },
        },
        {
            event: { value: "Covid-19" },
            location: { value: "Lusaka" },
            cases: { value: "64" },
            deaths: { value: "32" },
            duration: { value: "14d" },
            manager: { value: "Jed Selma" },
            detect7d: { value: "7", color: "green" },
            notify1d: { value: "1", color: "green" },
            era1: { value: "1" },
            era2: { value: "7" },
            era3: { value: "7" },
            era4: { value: "7" },
            era5: { value: "7" },
            era6: { value: "7" },
            era7: { value: "7" },
            eri: { value: "7" },
            respond7d: { value: "7", color: "green" },
        },
        {
            event: { value: "Covid-19" },
            location: { value: "North Western" },
            cases: { value: "64" },
            deaths: { value: "32" },
            duration: { value: "13d" },
            manager: { value: "Meg Amy" },
            detect7d: { value: "6", color: "green" },
            notify1d: { value: "3", color: "red" },
            era1: { value: "6" },
            era2: { value: "7" },
            era3: { value: "7" },
            era4: { value: "7" },
            era5: { value: "7" },
            era6: { value: "7" },
            era7: { value: "7" },
            eri: { value: "7" },
            respond7d: { value: "7", color: "green" },
        },
        {
            event: { value: "Cholera" },
            location: { value: "Eastern" },
            cases: { value: "10" },
            deaths: { value: "3" },
            duration: { value: "17d" },
            manager: { value: "Mary Cole" },
            detect7d: { value: "10", color: "red" },
            notify1d: { value: "3", color: "red" },
            era1: { value: "4", color: "red" },
            era2: { value: "10", color: "red" },
            era3: { value: "9", color: "red" },
            era4: { value: "12", color: "red" },
            era5: { value: "12", color: "red" },
            era6: { value: "5", color: "red" },
            era7: { value: "7" },
            eri: { value: "7" },
            respond7d: { value: "12", color: "red" },
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
