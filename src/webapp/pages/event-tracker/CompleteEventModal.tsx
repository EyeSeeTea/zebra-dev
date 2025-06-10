import React from "react";
import i18n from "../../../utils/i18n";
import { Button, useTheme } from "@material-ui/core";
import { SimpleModal } from "../../components/simple-modal/SimpleModal";

type CompleteEventModalProps = {
    modalText?: string;
    openModal: boolean;
    onCloseModal: () => void;
    onCompleteClick: () => void;
};

export const CompleteEventModal: React.FC<CompleteEventModalProps> = React.memo(props => {
    const { modalText, openModal, onCloseModal, onCompleteClick } = props;
    const theme = useTheme();

    return (
        <SimpleModal
            open={openModal}
            onClose={onCloseModal}
            title={i18n.t("Complete event")}
            closeLabel={i18n.t("Not now")}
            footerButtons={
                <Button
                    variant="contained"
                    onClick={() => onCompleteClick()}
                    style={{
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.common.white,
                    }}
                >
                    {i18n.t("Complete")}
                </Button>
            }
            alignFooterButtons="end"
            buttonDirection="row-reverse"
        >
            {modalText
                ? modalText
                : i18n.t("Are you sure you want to complete this Event? This cannot be undone.")}
        </SimpleModal>
    );
});
