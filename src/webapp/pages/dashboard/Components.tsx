import React, { useState } from "react";
import styled from "styled-components";

import { Button } from "../../components/button/Button";
import { AddNewOption } from "../../components/add-new-option/AddNewOption";
import { AvatarCard } from "../../components/avatar-card/AvatarCard";
import { DatePicker } from "../../components/date-picker/DatePicker";
import { InputField } from "../../components/input-field/InputField";
import { MultipleSelector } from "../../components/multiple-selector/MultipleSelector";
import { NACheckbox } from "../../components/not-applicable-checkbox/NACheckbox";
import { RadioButtonsGroup } from "../../components/radio-buttons-group/RadioButtonsGroup";
import { Selector } from "../../components/selector/Selector";
import { TextArea } from "../../components/text-area/TextArea";
import { StatsCard } from "../../components/stats-card/StatsCard";
import { SearchInput } from "../../components/search-input/SearchInput";
import { NoticeBox } from "../../components/notice-box/NoticeBox";
import { ProfileModal } from "../../components/profile-modal/ProfileModal";

export const Components: React.FC = React.memo(() => {
    const [date, setDate] = useState<Date | null>(null);
    const [select, setSelect] = useState("");
    const [multi, setMulti] = useState<string[]>([]);
    const [radio, setRadio] = useState("");
    const [naCheck, setNACheck] = useState(false);
    const [area, setArea] = useState("");
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openProfileModal, setOpenProfileModal] = useState(false);

    return (
        <>
            <Container>
                <Button
                    onClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                >
                    Text
                </Button>
                <Button
                    onClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    variant="outlined"
                >
                    Text
                </Button>
                <Button
                    onClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    variant="outlined"
                    color="secondary"
                >
                    Text
                </Button>
                <Button
                    onClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    color="secondary"
                >
                    Text
                </Button>
                <Button
                    onClick={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    variant="outlined"
                    color="dark-secondary"
                >
                    Text
                </Button>
            </Container>
            <Container>
                <AddNewOption
                    id={""}
                    onAddNewOption={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                />
            </Container>
            <Container width="300px">
                <AvatarCard>Text</AvatarCard>
            </Container>
            <Container>
                <DatePicker id={""} label="DatePicker" onChange={setDate} value={date} />
            </Container>
            <Container>
                <InputField
                    id={""}
                    label="InputField"
                    value={input}
                    onChange={event => setInput(event.target.value)}
                />
            </Container>
            <Container>
                <MultipleSelector
                    id={""}
                    label="MultipleSelector"
                    selected={multi}
                    onChange={setMulti}
                    options={[
                        { value: "1", label: "value 1" },
                        { value: "2", label: "value 2" },
                    ]}
                />
            </Container>
            <Container>
                <NACheckbox id={""} checked={naCheck} onChange={setNACheck} />
            </Container>
            <Container>
                <RadioButtonsGroup
                    id={""}
                    selected={radio}
                    onChange={event => setRadio(event.target.value)}
                    options={[
                        { value: "1", label: "value 1" },
                        { value: "2", label: "value 2" },
                    ]}
                />
            </Container>
            <Container>
                <Selector
                    id={""}
                    label="Selector"
                    selected={select}
                    onChange={setSelect}
                    options={[
                        { value: "1", label: "value 1" },
                        { value: "2", label: "value 2" },
                    ]}
                />
            </Container>
            <Container>
                <TextArea id={""} label="TextArea" value={area} onChange={setArea} />
            </Container>
            <Container>
                <StatsCard
                    stat={"10"}
                    pretitle={"pretitle"}
                    title={"title"}
                    subtitle={"subtitle"}
                    color="green"
                    isPercentage
                />
                <StatsCard
                    stat={"100"}
                    pretitle={"pretitle"}
                    title={"title"}
                    subtitle={"subtitle"}
                    color="red"
                    isPercentage
                />
                <StatsCard
                    stat={"600"}
                    pretitle={"pretitle"}
                    title={"title very very very very long"}
                    subtitle={"subtitle"}
                />
                <StatsCard
                    stat="Inc"
                    pretitle={"pretitle"}
                    title={"title"}
                    subtitle={"subtitle"}
                    color="red"
                    error
                />
            </Container>
            <Container>
                <SearchInput
                    value={searchTerm}
                    onChange={(value: string) => setSearchTerm(value)}
                />
            </Container>
            <Container>
                <NoticeBox title={"Risk assessment incomplete"}>
                    Risk assessment incomplete
                </NoticeBox>
            </Container>
            <Container>
                <Button onClick={() => setOpenProfileModal(true)}>Open Profile Modal</Button>
                <ProfileModal
                    name={"Name"}
                    open={openProfileModal}
                    onClose={() => setOpenProfileModal(false)}
                >
                    Profile
                </ProfileModal>
            </Container>
        </>
    );
});

const Container = styled.div<{ width?: string }>`
    margin-block: 25px;
    display: flex;
    gap: 10px;
    width: ${props => props.width || "100%"};
    flex-wrap: wrap;
`;
