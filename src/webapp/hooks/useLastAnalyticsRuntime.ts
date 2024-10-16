import { useEffect, useState } from "react";
import { useAppContext } from "../contexts/app-context";

export function useLastAnalyticsRuntime() {
    const { compositionRoot } = useAppContext();
    const [lastAnalyticsRuntime, setLastAnalyticsRuntime] = useState<string>();

    useEffect(() => {
        compositionRoot.performanceOverview.getAnalyticsRuntime.execute().run(
            analyticsRuntime => {
                setLastAnalyticsRuntime(analyticsRuntime);
            },
            err => {
                console.debug(err);
            }
        );
    }, [compositionRoot.performanceOverview.getAnalyticsRuntime]);

    return { lastAnalyticsRuntime };
}
