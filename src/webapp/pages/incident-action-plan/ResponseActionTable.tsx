import React from "react";
import i18n from "../../../utils/i18n";
import { RouteName, useRoutes } from "../../hooks/useRoutes";
import { Section } from "../../components/section/Section";
import { BasicTable, TableColumn, TableRowType } from "../../components/table/BasicTable";
import { Box, Button } from "@material-ui/core";
import { AddCircleOutline, EditOutlined } from "@material-ui/icons";
import { Maybe } from "../../../utils/ts-utils";

type ResponseActionTableProps = {
    onChange: (value: Maybe<string>, rowIndex: number, column: TableColumn["value"]) => void;
    responseActionColumns: TableColumn[];
    responseActionRows: {
        [key: TableColumn["value"]]: string;
    }[];
};

export const ResponseActionTable: React.FC<ResponseActionTableProps> = React.memo(
    ({ onChange, responseActionColumns, responseActionRows }) => {
        const { goTo } = useRoutes();

        const { icon: responseActionIcon, label: responseActionLabel } =
            getResponseActionTableLabel(responseActionRows);

        return (
            <Section
                title="Response Actions"
                hasSeparator={true}
                headerButton={
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={responseActionIcon}
                        onClick={() => {
                            goTo(RouteName.CREATE_FORM, {
                                formType: "incident-response-action",
                            });
                        }}
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
