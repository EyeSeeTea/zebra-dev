import React, { useCallback } from "react";
import i18n from "../../../utils/i18n";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Section } from "../../components/section/Section";
import { BasicTable, TableColumn, TableRowType } from "../../components/table/BasicTable";
import { Box, Button } from "@material-ui/core";
import { AddCircleOutline, EditOutlined } from "@material-ui/icons";
import { Maybe } from "../../../utils/ts-utils";

type ResponseActionTableProps = {
    onChange: (value: Maybe<string>, rowIndex: number, column: TableColumn["value"]) => void;
    onOrderBy: (direction: "asc" | "desc") => void;
    responseActionColumns: TableColumn[];
    responseActionRows: {
        [key: TableColumn["value"]]: string;
    }[];
};

export const ResponseActionTable: React.FC<ResponseActionTableProps> = React.memo(
    ({ onChange, onOrderBy, responseActionColumns, responseActionRows }) => {
        const { goTo } = useRoutes();

        const { icon: responseActionIcon, label: responseActionLabel } =
            getResponseActionTableLabel(responseActionRows);

        const goToCreateResponseAction = useCallback(() => {
            goTo(RouteName.CREATE_FORM, {
                formType: "incident-response-action",
            });
        }, [goTo]);

        return (
            <Section
                title="Response Actions"
                hasSeparator={true}
                headerButton={
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={responseActionIcon}
                        onClick={goToCreateResponseAction}
                    >
                        {i18n.t(responseActionLabel)}
                    </Button>
                }
                titleVariant="secondary"
            >
                <BasicTable
                    onChange={onChange}
                    columns={responseActionColumns}
                    rows={responseActionRows}
                    onOrderBy={onOrderBy}
                />
                <Box sx={{ m: 5 }} />
            </Section>
        );
    }
);

function getResponseActionTableLabel(responseActionRows: TableRowType[]) {
    const label =
        responseActionRows.length === 0 ? "Add new Response Action" : "Edit Response Actions";
    const icon = responseActionRows.length === 0 ? <AddCircleOutline /> : <EditOutlined />;

    return { icon: icon, label: label };
}
