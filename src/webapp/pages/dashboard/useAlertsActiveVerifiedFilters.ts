import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/app-context";
import { OrgUnit } from "../../../domain/entities/OrgUnit";
import { Option } from "../../components/utils/option";
import { diseaseNames } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";

export type SelectorFiltersConfig = {
    id: string;
    label: string;
    placeholder: string;
    type: "multiselector" | "singleselector";
    options: Option[];
};

export const incidentStatusOptions = [
    { value: "Watch", label: "Watch" },
    { value: "Alert", label: "Alert" },
    { value: "Respond", label: "Respond" },
];

type State = {
    selectorFiltersConfig: SelectorFiltersConfig[];
    singleSelectFilters: Record<string, string>;
    setSingleSelectFilters: (id: string, value: string) => void;
    multiSelectFilters: Record<string, string[]>;
    setMultiSelectFilters: (id: string, values: string[]) => void;
    dateRangeFilter: {
        onChange: (value: string[]) => void;
        value: string[];
    };
};

export function useAlertsActiveVerifiedFilters(): State {
    const { compositionRoot } = useAppContext();

    const [singleSelectFilters, setSingleSelectsFilters] = useState<Record<string, string>>({
        disease: "",
        incidentStatus: "",
    });
    const [multiSelectFilters, setMultiSelectFilters] = useState<Record<string, string[]>>({
        province: [],
    });

    const [provincesOptions, setProvincesOptions] = useState<Option[]>([]);

    const [selectedRangeDateFilter, setSelectedRangeDateFilter] = useState<string[]>([]);

    const [selectorFiltersConfig, setSelectorFiltersConfig] = useState<SelectorFiltersConfig[]>([]);

    useEffect(() => {
        compositionRoot.orgUnits.getProvinces.execute().run(
            orgUnits => {
                setProvincesOptions(buildProvinceOptions(orgUnits));
            },
            error => {
                console.error({ error });
            }
        );
    }, [compositionRoot.orgUnits.getProvinces]);

    const handleSetSingleSelectFilters = useCallback((id: string, value: string) => {
        setSingleSelectsFilters(prevSingleSelectFilters => {
            return { ...prevSingleSelectFilters, [id]: value };
        });
    }, []);

    const handleSetMultiSelectFilters = useCallback((id: string, values: string[]) => {
        setMultiSelectFilters(prevMultiSelectFilters => ({
            ...prevMultiSelectFilters,
            [id]: values,
        }));
    }, []);

    // Initialize filter options based on eventTrackerCountsIndicatorMap
    useEffect(() => {
        const buildSelectorFiltersConfig = (): SelectorFiltersConfig[] => {
            const diseaseOptions = diseaseNames.map(diseaseName => ({
                value: diseaseName,
                label: diseaseName,
            }));

            return [
                {
                    id: "incidentStatus",
                    label: "Incident Status",
                    placeholder: "Select Incident Status",
                    type: "singleselector",
                    options: incidentStatusOptions,
                },
                {
                    id: "disease",
                    label: "Disease",
                    placeholder: "Select Disease",
                    type: "singleselector",
                    options: diseaseOptions,
                },
                {
                    id: "province",
                    label: "Provinces",
                    placeholder: "Select Provinces",
                    type: "multiselector",
                    options: provincesOptions,
                },
            ];
        };

        setSelectorFiltersConfig(buildSelectorFiltersConfig());
    }, [provincesOptions]);

    return {
        selectorFiltersConfig,
        singleSelectFilters,
        setSingleSelectFilters: handleSetSingleSelectFilters,
        multiSelectFilters,
        setMultiSelectFilters: handleSetMultiSelectFilters,
        dateRangeFilter: {
            onChange: setSelectedRangeDateFilter,
            value: selectedRangeDateFilter,
        },
    };
}

function buildProvinceOptions(provinces: OrgUnit[]): Option[] {
    return provinces.map(province => ({
        value: province.id,
        label: province.name,
    }));
}
