import { ResourceFormData } from "../../../../domain/entities/ConfigurableForm";
import {
    isDiseaseOutbreakEventDocument,
    isResponseDocument,
} from "../../../../domain/entities/resources/Resource";
import { getFieldIdFromIdsDictionary } from "../../../components/form/FormFieldsState";
import { Option as UIOption } from "../../../components/utils/option";
import { FormState } from "../../../components/form/FormState";
import { mapToPresentationOptions } from "../mapEntityToFormState";
import { ResourcePermissions } from "../../../../domain/entities/resources/ResourcePermissions";
import { ResourceType } from "../../../../domain/entities/resources/ResourceTypeNamed";

export const resourceFieldIds = {
    resourceType: "resourceType",
    resourceLabel: "resourceLabel",
    resourceDiseaseOutbreakEventId: "resourceDiseaseOutbreakEventId",
    responseResourceFolder: "responseResourceFolder",
    eventResourceFolder: "eventResourceFolder",
    resourceFile: "resourceFile",
};

export function mapResourceToInitialFormState(
    formData: ResourceFormData,
    resourcePermissions: ResourcePermissions
): FormState {
    const { entity: resource, uploadedResourceFile, options } = formData;
    const isResourceResponseDocument = resource && isResponseDocument(resource);
    const isResourceDiseaseOutbreakEventDocument =
        resource && isDiseaseOutbreakEventDocument(resource);

    const { resourceType, resourceFolder, activeDiseaseOutbreakEvents } = options;
    const resourceTypeOptions: UIOption[] = mapToPresentationOptions(resourceType);
    const responseDocumentsFolderOptions: UIOption[] = mapToPresentationOptions(
        resourceFolder.filter(doc => doc.resourceType === ResourceType.RESPONSE_DOCUMENT)
    );
    const eventDocumentsFolderOptions: UIOption[] = mapToPresentationOptions(
        resourceFolder.filter(
            doc => doc.resourceType === ResourceType.DISEASE_OUTBREAK_EVENT_DOCUMENT
        )
    );
    const activeDiseaseOutbreakEventOptions: UIOption[] = mapToPresentationOptions(
        activeDiseaseOutbreakEvents
    );

    const fromIdsDictionary = (key: keyof typeof resourceFieldIds) =>
        getFieldIdFromIdsDictionary(key, resourceFieldIds);
    const { isAdmin } = resourcePermissions;

    return {
        id: resource?.id ?? "",
        title: "Resources",
        saveButtonLabel: "Save",
        isValid: false,
        sections: [
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
                        value: resource?.name || "",
                        required: true,
                    },
                ],
            },
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
                        value: resource?.type || "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource event",
                id: `${fromIdsDictionary("resourceDiseaseOutbreakEventId")}_section`,
                isVisible: isResourceDiseaseOutbreakEventDocument,
                required: true,
                fields: [
                    {
                        id: fromIdsDictionary("resourceDiseaseOutbreakEventId"),
                        placeholder: "Select the corresponding event",
                        isVisible: isResourceDiseaseOutbreakEventDocument,
                        errors: [],
                        type: "select",
                        multiple: false,
                        options: activeDiseaseOutbreakEventOptions || [],
                        value: isResourceDiseaseOutbreakEventDocument
                            ? resource?.diseaseOutbreakEventId || ""
                            : "",
                        required: true,
                    },
                ],
            },
            {
                title: "Resource folder",
                id: `${fromIdsDictionary("responseResourceFolder")}_section`,
                isVisible: isResourceResponseDocument,
                required: true,
                fields:
                    responseDocumentsFolderOptions.length === 0
                        ? [
                              {
                                  id: fromIdsDictionary("responseResourceFolder"),
                                  isVisible: isResourceResponseDocument,
                                  errors: [],
                                  type: "text",
                                  value: isResourceResponseDocument ? resource.folder : "",
                                  required: true,
                              },
                          ]
                        : [
                              {
                                  id: fromIdsDictionary("responseResourceFolder"),
                                  isVisible: isResourceResponseDocument,
                                  errors: [],
                                  type: "select",
                                  options: responseDocumentsFolderOptions,
                                  multiple: false,
                                  addNewOption: isAdmin,
                                  value: isResourceResponseDocument ? resource.folder : "",
                                  required: true,
                              },
                          ],
            },
            {
                title: "Resource folder",
                id: `${fromIdsDictionary("eventResourceFolder")}_section`,
                isVisible: isResourceDiseaseOutbreakEventDocument,
                required: true,
                fields:
                    eventDocumentsFolderOptions.length === 0
                        ? [
                              {
                                  id: fromIdsDictionary("eventResourceFolder"),
                                  isVisible: isResourceDiseaseOutbreakEventDocument,
                                  errors: [],
                                  type: "text",
                                  value: isResourceDiseaseOutbreakEventDocument
                                      ? resource.folder
                                      : "",
                                  required: true,
                              },
                          ]
                        : [
                              {
                                  id: fromIdsDictionary("eventResourceFolder"),
                                  isVisible: isResourceDiseaseOutbreakEventDocument,
                                  errors: [],
                                  type: "select",
                                  options: eventDocumentsFolderOptions,
                                  multiple: false,
                                  addNewOption: isAdmin,
                                  value: isResourceDiseaseOutbreakEventDocument
                                      ? resource.folder
                                      : "",
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
                        fileId: resource?.fileId || undefined,
                        required: true,
                        data: undefined,
                        fileTemplate: undefined,
                    },
                ],
            },
        ],
    };
}
