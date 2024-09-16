import { Dispatch, SetStateAction, useState } from "react";

export type MapFiltersState = {
    multiSelectFilters: Record<string, string[]>;
    setMultiSelectFilters: Dispatch<SetStateAction<Record<string, string[]>>>;
};

export function useMapFilters(): MapFiltersState {
    const [multiSelectFilters, setMultiSelectFilters] = useState<Record<string, string[]>>({
        duration: [],
    });

    return {
        multiSelectFilters,
        setMultiSelectFilters,
    };
}
