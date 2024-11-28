import { useEffect } from "react";
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
                    snackbar.error("You do not have permission to create/edit events");
                    break;
                case "incident-management-team-member-assignment":
                    snackbar.error(
                        "You do not have permission to create/edit IM team member assignments"
                    );
                    break;
                case "incident-action-plan":
                    snackbar.error(
                        "You do not have permission to create/edit incident action plans"
                    );
                    break;
                case "incident-response-actions":
                case "incident-response-action":
                    snackbar.error(
                        "You do not have permission to create/edit incident response actions"
                    );
                    break;
                case "risk-assessment-grading":
                case "risk-assessment-questionnaire":
                case "risk-assessment-summary":
                    snackbar.error("You do not have permission to create/edit risk assessments");
                    break;
                default:
                    snackbar.error("You do not have permission to create/edit this form");
                    break;
            }
            history.goBack();
        }
    }, [currentUser.hasCaptureAccess, formType, history, snackbar]);
}
