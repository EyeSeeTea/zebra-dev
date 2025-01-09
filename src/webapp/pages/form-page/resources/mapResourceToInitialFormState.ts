import { ResourceFormData } from "../../../../domain/entities/ConfigurableForm";
import { ResourceType } from "../../../../domain/entities/resources/Resource";
import { getFieldIdFromIdsDictionary } from "../../../components/form/FormFieldsState";
import { Option as UIOption } from "../../../components/utils/option";
import { FormState } from "../../../components/form/FormState";
import { mapToPresentationOptions } from "../mapEntityToFormState";

export const resourceFieldIds = {
    resourceType: "resourceType",
    resourceLabel: "resourceLabel",
    resourceFolder: "resourceFolder",
    resourceFile: "resourceFile",
};

export function mapResourceToInitialFormState(formData: ResourceFormData): FormState {
    const { entity: resource, uploadedResourceFile, uploadedResourceFileId, options } = formData;
    const isResourceDocument = resource?.resourceType === ResourceType.RESPONSE_DOCUMENT;

    const { resourceType, resourceFolder } = options;
    const resourceTypeOptions: UIOption[] = mapToPresentationOptions(resourceType);
    const resourceFolderOptions: UIOption[] = mapToPresentationOptions(resourceFolder);

    const fromIdsDictionary = (key: keyof typeof resourceFieldIds) =>
        getFieldIdFromIdsDictionary(key, resourceFieldIds);

    return {
        id: "",
        title: "Resources",
        subtitle: "",
        saveButtonLabel: "Save",
        isValid: false,
        sections: [
            {
                title: "Resource type",
                id: `${fromIdsDictionary("resourceType")}_section`,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: fromIdsDictionary("resourceType"),
                        placeholder: "Select a resource type",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: resourceTypeOptions,
                        value: resource?.resourceType || "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource name",
                id: `${fromIdsDictionary("resourceLabel")}_section`,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: fromIdsDictionary("resourceLabel"),
                        isVisible: true,
                        errors: [],
                        type: "text",
                        value: resource?.resourceLabel || "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource folder",
                id: `${fromIdsDictionary("resourceFolder")}_section`,
                isVisible: isResourceDocument,
                required: true,
                fields: [
                    {
                        id: fromIdsDictionary("resourceFolder"),
                        isVisible: isResourceDocument,
                        errors: [],
                        type: "select",
                        options: resourceFolderOptions,
                        multiple: false,
                        addNewOption: true,
                        value: isResourceDocument ? resource.resourceFolder : "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource file",
                id: `${fromIdsDictionary("resourceFile")}_section`,
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: fromIdsDictionary("resourceFile"),
                        isVisible: true,
                        errors: [],
                        type: "file",
                        value: uploadedResourceFile || undefined,
                        fileId: uploadedResourceFileId || undefined,
                        required: true,
                        data: undefined,
                        fileTemplate: undefined,
                    },
                ],
            },
        ],
    };
}
