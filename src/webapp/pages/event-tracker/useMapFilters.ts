import { useState } from "react";

export type MapFiltersState = {
    dateRangeFilter: {
        onChange: (value: string[]) => void;
        value: string[];
    };
};

export function useMapFilters(): MapFiltersState {
    const [selectedRangeDateFilter, setSelectedRangeDateFilter] = useState<string[]>([]);

    return {
        dateRangeFilter: {
            onChange: setSelectedRangeDateFilter,
            value: selectedRangeDateFilter,
        },
    };
}
