import { FutureData } from "../../../../data/api-futures";
import { DiseaseOutbreakEventFormData, FormLables } from "../../../entities/ConfigurableForm";
import {
    CasesDataSource,
    DataSource,
    DiseaseOutbreakEvent,
} from "../../../entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../entities/generic/Future";
import { Id } from "../../../entities/Ref";
import { Rule } from "../../../entities/Rule";
import { DiseaseOutbreakEventRepository } from "../../../repositories/DiseaseOutbreakEventRepository";
import { Configurations } from "../../../entities/AppConfigurations";
import { CasesFileRepository } from "../../../repositories/CasesFileRepository";
import { getOutbreakKey } from "../../../entities/AlertsAndCaseForCasesData";

export function getDiseaseOutbreakConfigurableForm(
    options: {
        diseaseOutbreakEventRepository: DiseaseOutbreakEventRepository;
        casesFileRepository: CasesFileRepository;
    },
    configurations: Configurations,
    formType: "disease-outbreak-event" | "disease-outbreak-event-case-data",
    id?: Id
): FutureData<DiseaseOutbreakEventFormData> {
    const { rules, labels } = getEventTrackerLabelsRules();

    const diseaseOutbreakForm: DiseaseOutbreakEventFormData = {
        type: formType,
        entity: undefined,
        uploadedCasesDataFile: undefined,
        uploadedCasesDataFileId: undefined,
        hasInitiallyCasesDataFile: false,
        caseDataFileTemplete: undefined,
        rules: rules,
        labels: labels,
        options: configurations.selectableOptions.eventTrackerConfigurations,
        orgUnits: configurations.orgUnits,
    };

    if (id) {
        return options.diseaseOutbreakEventRepository.get(id).flatMap(diseaseOutbreakEventBase => {
            const diseaseOutbreakEvent: DiseaseOutbreakEvent = new DiseaseOutbreakEvent({
                ...diseaseOutbreakEventBase,

                // NOTICE: Not needed in form but required
                createdBy: undefined,
                mainSyndrome: undefined,
                suspectedDisease: undefined,
                notificationSource: undefined,
                incidentManager: undefined,
                riskAssessment: undefined,
                incidentActionPlan: undefined,
                incidentManagementTeam: undefined,
                uploadedCasesData: undefined,
                resource: [],
            });

            const outbreakKey = getOutbreakKey({
                dataSource: diseaseOutbreakEvent.dataSource,
                outbreakValue:
                    diseaseOutbreakEvent.suspectedDiseaseCode || diseaseOutbreakEvent.hazardType,
                hazardTypes:
                    configurations.selectableOptions.eventTrackerConfigurations.hazardTypes,
                suspectedDiseases:
                    configurations.selectableOptions.eventTrackerConfigurations.suspectedDiseases,
            });

            const hasCasesDataFile =
                diseaseOutbreakEvent.casesDataSource ===
                CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF;

            const populatedDiseaseOutbreakForm: DiseaseOutbreakEventFormData = {
                ...diseaseOutbreakForm,
                entity: diseaseOutbreakEvent,
            };

            if (hasCasesDataFile) {
                return options.casesFileRepository.getTemplate().flatMap(casesFileTemplate => {
                    return options.casesFileRepository.get(outbreakKey).flatMap(casesDataFile => {
                        const populatedDiseaseOutbreakFormWithFile: DiseaseOutbreakEventFormData = {
                            ...populatedDiseaseOutbreakForm,
                            caseDataFileTemplete: casesFileTemplate.file,
                            uploadedCasesDataFile: casesDataFile.file,
                            uploadedCasesDataFileId: casesDataFile.fileId,
                            hasInitiallyCasesDataFile: true,
                        };
                        return Future.success(populatedDiseaseOutbreakFormWithFile);
                    });
                });
            } else {
                return Future.success(populatedDiseaseOutbreakForm);
            }
        });
    } else {
        return options.casesFileRepository.getTemplate().flatMap(casesFileTemplate => {
            return Future.success({
                ...diseaseOutbreakForm,
                caseDataFileTemplete: casesFileTemplate.file,
            });
        });
    }
}

function getEventTrackerLabelsRules(): { rules: Rule[]; labels: FormLables } {
    return {
        // TODO: Get labels from Datastore used in mapEntityToInitialFormState to create initial form state
        labels: {
            errors: {
                field_is_required: "This field is required",
                field_is_required_na: "This field is required when not applicable",
                file_missing: "File is missing",
                file_empty: "File is empty",
            },
        },
        // TODO: Get rules from Datastore used in applyRulesInFormState
        rules: [
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "dataSource",
                fieldValue: DataSource.RTSL_ZEB_OS_DATA_SOURCE_EBS,
                sectionIds: ["hazardType_section"],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "dataSource",
                fieldValue: DataSource.RTSL_ZEB_OS_DATA_SOURCE_IBS,
                sectionIds: ["mainSyndrome_section", "suspectedDisease_section"],
            },
            {
                type: "toggleSectionsVisibilityByFieldValue",
                fieldId: "casesDataSource",
                fieldValue: CasesDataSource.RTSL_ZEB_OS_CASE_DATA_SOURCE_USER_DEF,
                sectionIds: ["casesDataFile_section"],
            },
        ],
    };
}
