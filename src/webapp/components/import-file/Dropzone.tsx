import React, { useImperativeHandle, useRef } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

type DropzoneProps = DropzoneOptions & {
    children?: React.ReactNode;
    visible?: boolean;
};

export type CustomDropzoneRef = {
    openDialog: () => void;
};

export const Dropzone = React.forwardRef(
    (props: DropzoneProps, ref: React.ForwardedRef<CustomDropzoneRef>) => {
        const childrenRef = useRef<HTMLDivElement>(null);
        const { getRootProps, getInputProps, open } = useDropzone({
            noClick: !props.visible,
            ...props,
        });

        useImperativeHandle(ref, () => ({
            openDialog() {
                open();
            },
        }));

        return (
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div ref={childrenRef} style={{ display: "flex", alignItems: "center" }}>
                    {props.children}
                </div>
            </div>
        );
    }
);
