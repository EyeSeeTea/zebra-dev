import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import { DiseaseTotalAttrs } from "../../../data/repositories/AnalyticsD2Repository";

type State = {
    diseasesTotal: DiseaseTotalAttrs[];
    isLoading: boolean;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function useDiseasesTotal(filters: Record<string, string[]>): State {
    const { compositionRoot } = useAppContext();

    const [diseasesTotal, setDiseasesTotal] = useState<DiseaseTotalAttrs[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        compositionRoot.analytics.getDiseasesTotal.execute(filters).run(
            diseasesTotal => {
                setDiseasesTotal(diseasesTotal);
                setIsLoading(false);
            },
            error => {
                console.error({ error });
                setIsLoading(false);
            }
        );
    }, [compositionRoot.analytics.getDiseasesTotal, filters]);

    return {
        diseasesTotal,
        isLoading,
    };
}
