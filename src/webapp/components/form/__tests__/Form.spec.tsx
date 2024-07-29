import { getReactComponent } from "../../../../utils/tests";
import { FormProps, Form } from "../Form";
import { FormFieldState, FormState } from "../FormState";

describe("Given Form component", () => {
    describe("When render form and its layout", () => {
        it("Then show form title", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Form Title")).toBeInTheDocument();
        });

        it("Then show form subtitle", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Form Subtitle")).toBeInTheDocument();
        });

        it("Then show save button label", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Save & continue")).toBeInTheDocument();
        });

        it("Then show save button disabled if form is not valid", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(view.getByRole("button", { name: /save & continue/i })).toBeDisabled();
        });

        it("Then show save button enabled if form is valid", async () => {
            const formProps = givenFormProps();

            const view = getView({
                ...formProps,
                formState: {
                    ...formProps.formState,
                    isValid: true,
                },
            });

            expect(view.getByRole("button", { name: /save & continue/i })).not.toBeDisabled();
        });

        it("Then show cancel button label and has to be enabled", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Cancel & back")).toBeInTheDocument();
            expect(view.getByRole("button", { name: /cancel & back/i })).not.toBeDisabled();
        });

        it("Then show *indicates required text", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Indicates required")).toBeInTheDocument();
        });
    });

    describe("When render form and its sections", () => {
        it("Then section is shown if it is visible", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Text section Title")).toBeInTheDocument();
        });

        it("Then section is not shown if it is not visible", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(view.queryByText("Text section Title not visible")).toBeNull();
        });

        it("Then section title has required class if it's required", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            const titleElement = await view.findByText("Text section Title");
            expect(titleElement).toHaveClass("required");
        });

        it("Then section title has not required class if it's not required", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            const titleElement = await view.findByText("Text section Title not required");
            expect(titleElement).not.toHaveClass("required");
        });

        it("Then section title has info icon button if there is a function", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            const sectionInfoButton = view.getByLabelText("Section information");

            expect(sectionInfoButton).toBeInTheDocument();
        });

        it("Then if section has a visible field, this has to be seen", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Field text visible required")).toBeInTheDocument();
        });

        it("Then if section has a not visible field, this has not to be seen", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(view.queryByText("Field text not visible")).toBeNull();
        });

        it("Then if section has subsections, show title", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(
                await view.findByText(
                    "1. Initiate investigation or deploy an investigation/response."
                )
            ).toBeInTheDocument();
        });

        it("Then if section has a visible subsection field, this has to be seen", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("Subsection field visible")).toBeInTheDocument();
        });

        it("Then if section has a not visible subsection field, this has not to be seen", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(view.queryByText("Date Completed not visible")).toBeNull();
        });
    });

    describe("When render form and a field", () => {
        it("Then field label has required class if it's required", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            const titleElement = await view.findByText("Field text visible required");
            expect(titleElement).toHaveClass("required");
        });

        it("Then field label has not required class if it's not required", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            const titleElement = await view.findByText("Field text visible not required");
            expect(titleElement).not.toHaveClass("required");
        });

        it("Then field helper text has to be visible", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            expect(await view.findByText("text field helper text required")).toBeInTheDocument();
        });

        it("Then if a field has an error, it has to be red color", async () => {
            const formProps = givenFormProps();

            const view = getView(formProps);

            const errorTextElement = await view.findByText("This is an error");
            expect(errorTextElement).toHaveStyle("color: rgb(198, 40, 40)");
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
            subtitle: "Form Subtitle",
            saveButtonLabel: "Save & continue",
            cancelButtonLabel: "Cancel & back",
            isValid: false,
            sections: [
                {
                    title: "Text section Title",
                    id: "Text_section",
                    isVisible: true,
                    required: true,
                    fields: [
                        {
                            id: "text required",
                            label: "Field text visible required",
                            isVisible: true,
                            helperText: "text field helper text required",
                            errors: [],
                            type: "text",
                            value: "text value required",
                            multiline: false,
                            required: true,
                            showIsRequired: true,
                        },
                        {
                            id: "text not required",
                            label: "Field text visible not required",
                            isVisible: true,
                            helperText: "text field helper text not required",
                            errors: ["This is an error"],
                            type: "text",
                            value: "text value not required",
                            multiline: false,
                            required: false,
                        },
                    ],
                },
                {
                    title: "Text section Title with info icon",
                    id: "Text_section",
                    isVisible: true,
                    required: true,
                    onClickInfo: () => {},
                    fields: [],
                },
                {
                    title: "Text section Title not required",
                    id: "Text_section",
                    isVisible: true,
                    required: false,
                    fields: [],
                },
                {
                    title: "Text section Title not visible",
                    id: "Text_section_not_visible",
                    isVisible: false,
                    required: true,
                    fields: [
                        {
                            id: "text_not_visible",
                            label: "Field text not visible",
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
                            multiple: false,
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
                            multiple: false,
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
                            multiple: false,
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
                                    label: "Subsection field visible",
                                    id: "1. Subsection field visible",
                                    isVisible: true,
                                    errors: [],
                                    type: "date",
                                    value: null,
                                },
                                {
                                    label: "Date Completed not visible",
                                    id: "2. Date Completed not visible",
                                    isVisible: false,
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
