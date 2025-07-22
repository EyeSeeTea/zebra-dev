import {
    getVerificationTypeByCode,
    responseActionConstants,
    verificationCodeMap,
} from "../../../../data/repositories/consts/IncidentActionConstants";
import {
    ResponseActionFormData,
    SingleResponseActionFormData,
} from "../../../../domain/entities/ConfigurableForm";
import {
    ResponseAction,
    Status,
    Verification,
} from "../../../../domain/entities/incident-action-plan/ResponseAction";
import {
    FormFieldState,
    getAllFieldsFromSections,
    getStringFieldValue,
} from "../../../components/form/FormFieldsState";
import { FormState } from "../../../components/form/FormState";

export function mapFormStateToIncidentResponseActions(
    formState: FormState,
    formData: ResponseActionFormData
): ResponseAction[] {
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const incidentResponseActions: ResponseAction[] = formState.sections
        .filter(section => !section.id.includes("addNewResponseActionSection"))
        .map((section): ResponseAction => {
            const sectionIndex = extractIndex(section.id);

            const mainTask = getStringFieldValue(
                `${responseActionConstants.mainTask}_${sectionIndex}`,
                allFields
            );

            const subActivities = getStringFieldValue(
                `${responseActionConstants.subActivities}_${sectionIndex}`,
                allFields
            );

            const subPillar = getStringFieldValue(
                `${responseActionConstants.subPillar}_${sectionIndex}`,
                allFields
            );

            const dueDate = allFields.find(field =>
                field.id.includes(`${responseActionConstants.dueDate}_${sectionIndex}`)
            )?.value as Date;

            const searchAssignROValue = getStringFieldValue(
                `${responseActionConstants.searchAssignRO}_${sectionIndex}`,
                allFields
            );

            const searchAssignRO = formData.options.searchAssignRO.find(
                option => option.id === searchAssignROValue
            );
            if (!searchAssignRO) throw new Error("Responsible officer not found");

            const statusValue = getStringFieldValue(
                `${responseActionConstants.status}_${sectionIndex}`,
                allFields
            );

            const status = formData.options.status.find(option => option.id === statusValue);
            if (!status) throw new Error("Status not found");

            const verificationValue = getStringFieldValue(
                `${responseActionConstants.verification}_${sectionIndex}`,
                allFields
            );

            const verification = formData.options.verification.find(
                option => option.id === verificationValue
            ) ?? {
                id: verificationCodeMap.Unverified,
                name: getVerificationTypeByCode(verificationCodeMap.Unverified) ?? "",
            };
            if (!verification) throw new Error("Verification not found");

            const comments = getStringFieldValue(
                `${responseActionConstants.comments}_${sectionIndex}`,
                allFields
            );

            const blockers = getStringFieldValue(
                `${responseActionConstants.blockers}_${sectionIndex}`,
                allFields
            );

            const enablers = getStringFieldValue(
                `${responseActionConstants.enablers}_${sectionIndex}`,
                allFields
            );

            const selectedEntityData =
                sectionIndex !== undefined ? formData.entity[sectionIndex] : undefined;
            const isResponseActionValid = selectedEntityData !== undefined;
            const responseActionId = isResponseActionValid ? selectedEntityData.id : "";

            const responseAction = new ResponseAction({
                id: responseActionId,
                mainTask: mainTask,
                subActivities: subActivities,
                subPillar: subPillar,
                dueDate: dueDate,
                searchAssignRO: searchAssignRO,
                status: status.id as Status,
                verification: verification.id as Verification,
                comments: comments,
                blockers: blockers,
                enablers: enablers,
            });

            return responseAction;
        });

    return incidentResponseActions;
}

export function mapFormStateToIncidentResponseAction(
    formState: FormState,
    formData: SingleResponseActionFormData
): ResponseAction {
    const section = formState.sections[0];
    if (!section) throw new Error("No section found in form state");

    const sectionIndex = extractIndex(section.id);
    const allFields: FormFieldState[] = getAllFieldsFromSections(formState.sections);

    const mainTask = getStringFieldValue(
        `${responseActionConstants.mainTask}_${sectionIndex}`,
        allFields
    );

    const subActivities = getStringFieldValue(
        `${responseActionConstants.subActivities}_${sectionIndex}`,
        allFields
    );

    const subPillar = getStringFieldValue(
        `${responseActionConstants.subPillar}_${sectionIndex}`,
        allFields
    );

    const dueDate = allFields.find(field =>
        field.id.includes(`${responseActionConstants.dueDate}_${sectionIndex}`)
    )?.value as Date;

    const searchAssignROValue = getStringFieldValue(
        `${responseActionConstants.searchAssignRO}_${sectionIndex}`,
        allFields
    );

    const searchAssignRO = formData.options.searchAssignRO.find(
        option => option.id === searchAssignROValue
    );
    if (!searchAssignRO) throw new Error("Responsible officer not found");

    const statusValue = getStringFieldValue(
        `${responseActionConstants.status}_${sectionIndex}`,
        allFields
    );

    const status = formData.options.status.find(option => option.id === statusValue);
    if (!status) throw new Error("Status not found");

    const verificationValue = getStringFieldValue(
        `${responseActionConstants.verification}_${sectionIndex}`,
        allFields
    );

    const verification = formData.options.verification.find(
        option => option.id === verificationValue
    ) ?? {
        id: verificationCodeMap.Unverified,
        name: getVerificationTypeByCode(verificationCodeMap.Unverified) ?? "",
    };

    if (!verification) throw new Error("Verification not found");

    const comments = getStringFieldValue(
        `${responseActionConstants.comments}_${sectionIndex}`,
        allFields
    );

    const blockers = getStringFieldValue(
        `${responseActionConstants.blockers}_${sectionIndex}`,
        allFields
    );

    const enablers = getStringFieldValue(
        `${responseActionConstants.enablers}_${sectionIndex}`,
        allFields
    );

    const responseAction = new ResponseAction({
        id: formData.entity?.id ?? "",
        mainTask: mainTask,
        subActivities: subActivities,
        subPillar: subPillar,
        dueDate: dueDate,
        searchAssignRO: searchAssignRO,
        status: status.id as Status,
        verification: verification.id as Verification,
        comments: comments,
        blockers: blockers,
        enablers: enablers,
    });

    return responseAction;
}

function extractIndex(input: string): number | undefined {
    const parts = input.split("_");
    const lastPart = parts[parts.length - 1];
    const index = Number(lastPart);

    return isNaN(index) ? undefined : index;
}
