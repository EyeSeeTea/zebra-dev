import { getReactComponent } from "../../../../utils/tests";
import { FormProps, Form } from "../Form";
import { FormFieldState } from "../FormFieldState";
import { FormState } from "../FormState";

describe("Given Form component", () => {
    describe("When render form", () => {
        it("Then show form title", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Form Title")).toBeInTheDocument();
        });
    });
});

function getView(formProps: FormProps) {
    return getReactComponent(<Form {...formProps} />);
}

function givenFormProps(): FormProps {
    return {
        formState: {
            id: "Form Id",
            title: "Form Title",
            saveButtonLabel: "Save & continue",
            isValid: false,
            sections: [
                {
                    title: "Text section Title",
                    id: "Text_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "text",
                            isVisible: true,
                            helperText: "text field helper text",
                            errors: [],
                            type: "text",
                            value: "text value",
                            multiline: false,
                        },
                    ],
                },
                {
                    title: "Text section Title not visible",
                    id: "Text_section_not_visible",
                    isVisible: false,
                    required: true,
                    fields: [
                        {
                            id: "text_not_visible",
                            isVisible: false,
                            helperText: "helper text not visible",
                            errors: [],
                            type: "text",
                            value: "text not visible",
                            multiline: false,
                        },
                    ],
                },
                {
                    title: "Radio section Title",
                    id: "Radio_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "radio",
                            isVisible: true,
                            errors: [],
                            type: "radio",
                            options: [
                                {
                                    value: "radio 1",
                                    label: "radio 1",
                                },
                                {
                                    value: "radio 2",
                                    label: "radio 2",
                                },
                            ],
                            value: "radio 1",
                        },
                    ],
                },
                {
                    title: "Select section Title",
                    id: "Select_section_not_visible",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "Select_not_visible",
                            isVisible: false,
                            errors: [],
                            type: "select",
                            options: [
                                {
                                    value: "select 1 not visible",
                                    label: "select 1 not visible",
                                },
                                {
                                    value: "select 2 not visible",
                                    label: "select 2 not visible",
                                },
                            ],
                            value: "select 1 not visible",
                        },
                        {
                            id: "Select",
                            placeholder: "Select something",
                            isVisible: true,
                            errors: [],
                            type: "select",
                            options: [
                                {
                                    value: "select 1",
                                    label: "select 1",
                                },
                                {
                                    value: "select 2",
                                    label: "select 2",
                                },
                            ],
                            value: "select 1",
                        },
                    ],
                },
                {
                    title: "Multiple Select section Title",
                    id: "multipleselect_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "multipleselect",
                            label: "Provinces",
                            isVisible: true,
                            errors: [],
                            type: "select",
                            multiple: true,
                            options: [
                                {
                                    value: "multipleselect 1",
                                    label: "multipleselect 1",
                                },
                                {
                                    value: "multipleselect 2",
                                    label: "multipleselect 2",
                                },
                                {
                                    value: "multipleselect 3",
                                    label: "multipleselect 3",
                                },
                            ],
                            value: ["multipleselect 2", "multipleselect 3"],
                        },
                    ],
                },
                {
                    title: "Date section Title",
                    id: "Date_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "date",
                            isVisible: true,
                            errors: [],
                            type: "date",
                            value: null,
                        },
                    ],
                },
                {
                    title: "checkbox section Title",
                    id: "checkbox_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            label: "checkbox",
                            id: "checkbox",
                            isVisible: true,
                            errors: [],
                            type: "boolean",
                            value: false,
                        },
                    ],
                    subsections: [
                        {
                            title: "1. Initiate investigation or deploy an investigation/response.",
                            id: "1. Initiate investigation or deploy an investigation/response.",
                            isVisible: true,
                            required: true,
                            fields: [
                                {
                                    label: "Date Completed",
                                    id: "1. Date Completed",
                                    isVisible: true,
                                    errors: [],
                                    type: "date",
                                    value: null,
                                },
                            ],
                        },
                    ],
                },
                {
                    title: "Member section Title",
                    id: "Member_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "member",
                            placeholder: "Select a member",
                            isVisible: true,
                            errors: [],
                            type: "member",
                            options: [
                                {
                                    value: "1",
                                    label: "member 1",
                                    workPosition: "Postion",
                                    phone: "PhoneNumber",
                                    email: "Email",
                                    status: "Available",
                                    src: "url 1",
                                },
                                {
                                    value: "2",
                                    label: "member 2",
                                    workPosition: "Postion",
                                    phone: "PhoneNumber",
                                    email: "Email",
                                    status: "Unavailable",
                                    src: "url 2",
                                },
                            ],
                            value: "2",
                        },
                    ],
                },
                {
                    title: "Multiline Text section Title",
                    id: "Multiline_Text_section",
                    isVisible: true,
                    required: false,
                    fields: [
                        {
                            id: "Multiline_Text",
                            isVisible: true,
                            errors: [],
                            type: "text",
                            value: "Multiline Text value",
                            multiline: true,
                        },
                    ],
                },
            ],
        },
        onFormChange: (_newFormState: FormState, _updatedField: FormFieldState) => {},
        onSave: () => {},
        onCancel: () => {},
    };
}
