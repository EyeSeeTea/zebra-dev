import { DataValue } from "@eyeseetea/d2-api/api/trackerEvents";
import { Maybe } from "../../../utils/ts-utils";
import { Id } from "../../../domain/entities/Ref";

export function getValueById(dataValues: DataValue[], dataElement: string): Maybe<string> {
    return dataValues.find(dataValue => dataValue.dataElement === dataElement)?.value;
}

export function getDataValueById(dataValues: DataValue[], dataElement: string): Maybe<DataValue> {
    return dataValues.find(dataValue => dataValue.dataElement === dataElement);
}

export function getPopulatedDataElement(dataElement: Id, value: Maybe<string>): DataValue {
    const populatedDataElement: DataValue = {
        dataElement: dataElement,
        value: value ?? "",
        updatedAt: new Date().toISOString(),
        storedBy: "",
        createdAt: new Date().toISOString(),
        providedElsewhere: false,
    };
    return populatedDataElement;
}
