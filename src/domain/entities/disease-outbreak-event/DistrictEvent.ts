import { Maybe } from "../../../utils/ts-utils";
import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DistrictEvent = Pick<
    DiseaseOutbreakEventBaseAttrs,
    "id" | "name" | "hazardType" | "suspectedDiseaseCode"
> & {
    eventId: Maybe<string>;
    // eventType: "EBS" | "IBS"
};
