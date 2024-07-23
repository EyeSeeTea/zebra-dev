import React, { useEffect } from "react";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { useAppContext } from "../../contexts/app-context";

// TODO: Add every section here, first it's just an example

export const DashboardPage: React.FC = React.memo(() => {
    const { compositionRoot } = useAppContext();

    //TO DO : Remove, for testing only.
    useEffect(() => {
        compositionRoot.diseaseOutbreakEvent.get.execute("daFY6ofh6CU").run(
            diseaseOutbreakEvent => {
                console.debug(diseaseOutbreakEvent);
            },
            err => {
                console.error("Error fetching disease outbreak event", err);
            }
        );

        compositionRoot.diseaseOutbreakEvent.getAll.execute().run(
            diseaseOutbreakEvents => {
                console.debug(diseaseOutbreakEvents);
            },
            err => {
                console.error("Error fetching disease outbreak events", err);
            }
        );
    }, [compositionRoot.diseaseOutbreakEvent.get, compositionRoot.diseaseOutbreakEvent.getAll]);
    return (
        <Layout title={i18n.t("Dashboard")} showCreateEvent>
            <Section title={i18n.t("Respond, alert, watch")}>Respond, alert, watch content</Section>
        </Layout>
    );
});
