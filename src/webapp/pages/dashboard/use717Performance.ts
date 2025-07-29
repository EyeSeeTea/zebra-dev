import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import _ from "../../../domain/entities/generic/Collection";
import {
    isDiseaseName,
    PerformanceMetrics717Key,
    PerformanceMetricsStatus,
} from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Id } from "../../../domain/entities/Ref";
import { CardColors, transformData } from "../common/717Performance";

export type PerformanceMetric717 = {
    title: string;
    primaryValue: number | "Inc";
    secondaryValue: number | "Inc";
    color: CardColors;
    totalValue?: number;
};
export type PerformanceMetric717State = {
    performanceMetrics717: PerformanceMetric717[];
    isLoading: boolean;
    performanceMetricsStatus: PerformanceMetricsStatus;
    setPerformanceMetricsStatus: (status: PerformanceMetricsStatus) => void;
};

export type Order = { name: string; direction: "asc" | "desc" };

export function use717Performance(options: {
    type: PerformanceMetrics717Key;
    diseaseOutbreakEventId?: Id;
    singleSelectFilters?: Record<string, string>;
}): PerformanceMetric717State {
    const { compositionRoot } = useAppContext();
    const { type, diseaseOutbreakEventId, singleSelectFilters } = options;

    const [performanceMetrics717, setPerformanceMetrics717] = useState<PerformanceMetric717[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [performanceMetricsStatus, setPerformanceMetricsStatus] =
        useState<PerformanceMetricsStatus>("active");

    const diseaseName = useMemo(() => {
        return isDiseaseName(singleSelectFilters?.disease)
            ? singleSelectFilters.disease
            : undefined;
    }, [singleSelectFilters?.disease]);

    useEffect(() => {
        setIsLoading(true);

        compositionRoot.performanceOverview.get717Performance
            .execute({ type, diseaseOutbreakEventId, performanceMetricsStatus, diseaseName })
            .run(
                performanceMetrics717 => {
                    setPerformanceMetrics717(transformData(type, performanceMetrics717));
                    setIsLoading(false);
                },
                error => {
                    console.error({ error });
                    setIsLoading(false);
                }
            );
    }, [
        compositionRoot.performanceOverview.get717Performance,
        diseaseName,
        diseaseOutbreakEventId,
        performanceMetricsStatus,
        type,
    ]);

    return {
        performanceMetrics717,
        isLoading,
        performanceMetricsStatus,
        setPerformanceMetricsStatus,
    };
}
