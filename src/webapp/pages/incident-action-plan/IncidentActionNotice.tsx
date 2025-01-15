import React, { useCallback } from "react";
import { NoticeBox } from "../../components/notice-box/NoticeBox";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import i18n from "../../../utils/i18n";
import { Button } from "@material-ui/core";
import { EditOutlined } from "@material-ui/icons";

export const IncidentActionNotice: React.FC = React.memo(() => {
    const { goTo } = useRoutes();

    const goToIAP = useCallback(() => {
        goTo(RouteName.CREATE_FORM, {
            formType: "incident-action-plan",
        });
    }, [goTo]);

    return (
        <NoticeBox title={i18n.t("Create an incident action plan")}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <p>{i18n.t("No plan has been created for this incident")}</p>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditOutlined />}
                    onClick={goToIAP}
                >
                    {i18n.t("Create IAP")}
                </Button>
            </div>
        </NoticeBox>
    );
});
