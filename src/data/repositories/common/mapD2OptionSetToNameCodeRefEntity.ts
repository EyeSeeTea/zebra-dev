import { D2OptionSet } from "./getOptionSet";

type NameCodeRefEntity<C extends string> = {
    id: C;
    name: string;
};

export function mapD2OptionSetToNameCodeRefEntity<C extends string>(
    d2OptionSet: D2OptionSet,
    validCodesMap: Record<string, C>
): NameCodeRefEntity<C>[] {
    const validCodes = Object.values(validCodesMap);

    return d2OptionSet.options.reduce<NameCodeRefEntity<C>[]>((acc, option) => {
        const maybeValidCode = getSafeCode(validCodes, option.code);
        return maybeValidCode ? [...acc, { id: maybeValidCode, name: option.name }] : acc;
    }, []);
}

function getSafeCode<C extends string>(validCodes: C[], value: unknown): C | undefined {
    return Object.values(validCodes).includes(value as C) ? (value as C) : undefined;
}
