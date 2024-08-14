import { DiseaseOutbreakEventBaseAttrs } from "./DiseaseOutbreakEvent";

export type DistrictEvent = Pick<
    DiseaseOutbreakEventBaseAttrs,
    "id" | "name" | "hazardType" | "suspectedDiseaseCode"
>;
