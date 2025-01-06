import { ResourceFormData } from "../../../../domain/entities/ConfigurableForm";
import { ResourceType } from "../../../../domain/entities/resources/Resource";
import { FormState } from "../../../components/form/FormState";

export function mapResourcesToInitialFormState(formData: ResourceFormData): FormState {
    const { entity: resource, uploadedResourceFile, uploadedResourceFileId } = formData;

    const isResourceDocument = resource?.resourceType === ResourceType.RESOURCE_DOCUMENT;

    return {
        id: "",
        title: "Resources",
        subtitle: "",
        saveButtonLabel: "Save",
        isValid: false,
        sections: [
            {
                title: "Resource type",
                id: "resourceType_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "resourceType",
                        placeholder: "Select a resource type",
                        isVisible: true,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: [
                            {
                                value: ResourceType.RESOURCE_DOCUMENT,
                                label: "Resource document",
                            },
                            {
                                value: ResourceType.TEMPLATE,
                                label: "Template",
                            },
                        ],
                        value: resource?.resourceType || "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource name",
                id: "resourceName_section",
                isVisible: true,
                required: true,
                fields: [
                    {
                        id: "resourceName",
                        isVisible: true,
                        errors: [],
                        type: "text",
                        value: "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource folder",
                id: "resourceFolder_section",
                isVisible: isResourceDocument,
                required: true,
                fields: [
                    {
                        id: "resourceFolder",
                        isVisible: isResourceDocument,
                        errors: [],
                        type: "select",
                        options: [],
                        multiple: false,
                        value: isResourceDocument ? "" : "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource file",
                id: "resourceFile_section",
                isVisible: true,
                required: false,
                fields: [
                    {
                        id: "resourceFile",
                        isVisible: true,
                        errors: [],
                        type: "file",
                        value: uploadedResourceFile || undefined,
                        fileId: uploadedResourceFileId || undefined,
                        required: false,
                    },
                ],
            },
        ],
    };
}
