import { CodedNamedRef } from "../../../domain/entities/Ref";
import { D2OptionSet } from "./getOptionSet";

type ValidatedCodedNamedRef<C extends string> = {
    id: string;
    code: C;
    name: string;
};

export function mapD2OptionSetToValidatedCodedNamedRef<C extends string>(
    d2OptionSet: D2OptionSet,
    validCodesMap: Record<string, C>
): ValidatedCodedNamedRef<C>[] {
    const validCodes = Object.values(validCodesMap);

    return d2OptionSet.options.reduce<ValidatedCodedNamedRef<C>[]>((acc, option) => {
        const maybeValidCode = getSafeCode(validCodes, option.code);
        return maybeValidCode
            ? [...acc, { id: option.id, code: maybeValidCode, name: option.name }]
            : acc;
    }, []);
}

function getSafeCode<C extends string>(validCodes: C[], value: unknown): C | undefined {
    return Object.values(validCodes).includes(value as C) ? (value as C) : undefined;
}

export function mapD2OptionSetToCodedNamedRef(d2OptionSet: D2OptionSet): CodedNamedRef[] {
    return d2OptionSet.options.map(option => ({
        id: option.id,
        code: option.code,
        name: option.name,
    }));
}
