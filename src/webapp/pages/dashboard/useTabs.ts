import { useCallback, useState } from "react";

export type State = {
    tabIndexSelected: number;
    handleTabChange: (event: React.ChangeEvent<{}>, newTabIndexSelected: number) => void;
};

export function useTabs(): State {
    const [tabIndexSelected, setTabIndexSelected] = useState(0);

    const handleTabChange = useCallback(
        (_event: React.ChangeEvent<{}>, newTabIndexSelected: number) => {
            setTabIndexSelected(newTabIndexSelected);
        },
        []
    );

    return {
        tabIndexSelected,
        handleTabChange,
    };
}
