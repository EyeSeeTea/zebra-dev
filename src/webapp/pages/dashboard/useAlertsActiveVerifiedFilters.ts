import { useCallback, useEffect, useState } from "react";
import _c from "../../../domain/entities/generic/Collection";
import { useAppContext } from "../../contexts/app-context";
import { OrgUnit } from "../../../domain/entities/OrgUnit";
import { Option } from "../../components/utils/option";
import { eventTrackerCountsIndicatorMap } from "../../../data/repositories/consts/PerformanceOverviewConstants";

export type SelectorFiltersConfig = {
    id: string;
    label: string;
    placeholder: string;
    type: "multiselector" | "singleselector";
    options: Option[];
};

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
        hazard: "",
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
            const newFilters = { ...prevSingleSelectFilters, [id]: value };

            return id === "disease" && !!value
                ? { ...newFilters, hazard: "" }
                : id === "hazard" && !!value
                ? { ...newFilters, disease: "" }
                : newFilters;
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
            const createOptions = (key: "disease" | "hazard") =>
                _c(eventTrackerCountsIndicatorMap)
                    .filter(value => value.type === key)
                    .uniqBy(value => value.name)
                    .map(value => ({
                        value: value.name,
                        label: value.name,
                    }))

                    .value();

            const diseaseOptions = createOptions("disease");
            const hazardOptions = createOptions("hazard");

            return [
                {
                    id: "incidentStatus",
                    label: "Incident Status",
                    placeholder: "Select Incident Status",
                    type: "singleselector",
                    options: [
                        { value: "Respond", label: "Respond" },
                        { value: "Alert", label: "Alert" },
                        { value: "Watch", label: "Watch" },
                    ],
                },
                {
                    id: "disease",
                    label: "Disease",
                    placeholder: "Select Disease",
                    type: "singleselector",
                    options: diseaseOptions,
                },
                {
                    id: "hazard",
                    label: "Hazard Type",
                    placeholder: "Select Hazard Type",
                    type: "singleselector",
                    options: hazardOptions,
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
