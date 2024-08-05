import { D2Api, D2OptionSetSchema, SelectedPick } from "@eyeseetea/d2-api/2.36";
import { CodedNamedRef, Id, NamedRef } from "../../domain/entities/Ref";
import { apiToFuture, FutureData } from "../api-futures";
import { OptionsRepository } from "../../domain/repositories/OptionsRepository";
import { Future } from "../../domain/entities/generic/Future";

type D2OptionSet = SelectedPick<
    D2OptionSetSchema,
    {
        id: true;
        name: true;
        code: true;
        options: { id: true; name: true; code: true };
    }
>;

export class OptionsD2Repository implements OptionsRepository {
    constructor(private api: D2Api) {}

    get(id: Id): FutureData<NamedRef> {
        if (!id) return Future.success({ id: "", name: "" });
        return apiToFuture(
            this.api.metadata.get({
                options: { fields: { id: true, name: true }, filter: { code: { eq: id } } },
            })
        ).map(response => {
            if (!response.options[0]) throw new Error("Option not found");
            const option: NamedRef = {
                id: response.options[0].id,
                name: response.options[0].name,
            };
            return option;
        });
    }

    getAllHazardTypes(): FutureData<CodedNamedRef[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        options: { id: true, name: true, code: true },
                    },
                    filter: { code: { eq: "RTSL_ZEB_OS_HAZARD_TYPE" } },
                },
            })
        ).flatMap(response => {
            if (!response.optionSets[0]) throw new Error("Hazard Types options not found");

            return Future.success(this.mapD2OptionSetToCodedNamedRefs(response.optionSets[0]));
        });
    }

    getAllMainSyndromes(): FutureData<CodedNamedRef[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        options: { id: true, name: true, code: true },
                    },
                    filter: { code: { eq: "RTSL_ZEB_OS_SYNDROME" } },
                },
            })
        ).flatMap(response => {
            if (!response.optionSets[0]) throw new Error("Main Syndromes options not found");
            return Future.success(this.mapD2OptionSetToCodedNamedRefs(response.optionSets[0]));
        });
    }

    getAllSuspectedDiseases(): FutureData<CodedNamedRef[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        options: { id: true, name: true, code: true },
                    },
                    filter: { code: { eq: "RTSL_ZEB_OS_DISEASE" } },
                },
            })
        ).flatMap(response => {
            if (!response.optionSets[0]) throw new Error("Suspected Diseases options not found");

            return Future.success(this.mapD2OptionSetToCodedNamedRefs(response.optionSets[0]));
        });
    }

    getAllNotificationSources(): FutureData<CodedNamedRef[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        options: { id: true, name: true, code: true },
                    },
                    filter: { code: { eq: "RTSL_ZEB_OS_SOURCE" } },
                },
            })
        ).flatMap(response => {
            if (!response.optionSets[0]) throw new Error("Notification Sources options not found");
            return Future.success(this.mapD2OptionSetToCodedNamedRefs(response.optionSets[0]));
        });
    }

    getAllIncidentStatus(): FutureData<CodedNamedRef[]> {
        return apiToFuture(
            this.api.metadata.get({
                optionSets: {
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                        options: { id: true, name: true, code: true },
                    },
                    filter: { code: { eq: "RTSL_ZEB_OS_INCIDENT_STATUS" } },
                },
            })
        ).flatMap(response => {
            if (!response.optionSets[0]) throw new Error("Incident Status options not found");

            return Future.success(this.mapD2OptionSetToCodedNamedRefs(response.optionSets[0]));
        });
    }

    private mapD2OptionSetToCodedNamedRefs(optionSet: D2OptionSet): CodedNamedRef[] {
        return optionSet.options.map(option => {
            return {
                id: option.id,
                name: option.name,
                code: option.code,
            };
        });
    }
}
