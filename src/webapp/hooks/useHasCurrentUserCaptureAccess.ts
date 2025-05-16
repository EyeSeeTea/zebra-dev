import { useEffect } from "react";
import i18n from "../../utils/i18n";
import { useAppContext } from "../contexts/app-context";
import { FormType } from "../pages/form-page/FormPage";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import { useHistory } from "react-router-dom";

export function useCheckWritePermission(formType: FormType) {
    const { currentUser } = useAppContext();
    const snackbar = useSnackbar();
    const history = useHistory();

    useEffect(() => {
        if (!currentUser.hasCaptureAccess) {
            switch (formType) {
                case "disease-outbreak-event":
                    snackbar.error(i18n.t("You do not have permission to create/edit events"));
                    break;
                case "disease-outbreak-event-case-data":
                    snackbar.error(i18n.t("You do not have permission to replace case data"));
                    break;
                case "incident-management-team-member-assignment":
                    snackbar.error(
                        i18n.t(
                            "You do not have permission to create/edit IM team member assignments"
                        )
                    );
                    break;
                case "incident-action-plan":
                    snackbar.error(
                        i18n.t("You do not have permission to create/edit incident action plans")
                    );
                    break;
                case "incident-response-actions":
                case "incident-response-action":
                    snackbar.error(
                        i18n.t(
                            "You do not have permission to create/edit incident response actions"
                        )
                    );
                    break;
                case "risk-assessment-grading":
                case "risk-assessment-questionnaire":
                case "risk-assessment-summary":
                    snackbar.error(
                        i18n.t("You do not have permission to create/edit risk assessments")
                    );
                    break;
                default:
                    snackbar.error(i18n.t("You do not have permission to create/edit this form"));
                    break;
            }
            history.goBack();
        }
    }, [currentUser.hasCaptureAccess, formType, history, snackbar]);
}
