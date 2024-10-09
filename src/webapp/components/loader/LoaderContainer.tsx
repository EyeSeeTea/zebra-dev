import React from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";

interface LoaderContainerProps {
    loading: boolean;
    children: React.ReactNode;
}

const LoaderContainer: React.FC<LoaderContainerProps> = ({ loading, children }) => {
    return (
        <div style={{ position: "relative" }}>
            <Backdrop style={{ position: "absolute", zIndex: 1 }} open={loading} invisible={false}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div style={{ opacity: loading ? 0.5 : 1 }}>{children}</div>
        </div>
    );
};

export default LoaderContainer;
