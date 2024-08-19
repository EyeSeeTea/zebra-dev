import React, { useState } from "react";
import styled from "styled-components";

import i18n from "../../../utils/i18n";
import { Layout } from "../../components/layout/Layout";
import { Section } from "../../components/section/Section";
import { Button } from "../../components/button/Button";
import { AvatarCard } from "../../components/avatar-card/AvatarCard";
import { DatePicker } from "../../components/date-picker/DatePicker";
import { RadioButtonsGroup } from "../../components/radio-buttons-group/RadioButtonsGroup";
import { Selector } from "../../components/selector/Selector";
import { StatsCard } from "../../components/stats-card/StatsCard";
import { SearchInput } from "../../components/search-input/SearchInput";
import { NoticeBox } from "../../components/notice-box/NoticeBox";
import { ProfileModal } from "../../components/profile-modal/ProfileModal";
import { TextInput } from "../../components/text-input/TextInput";
import { MultipleSelector } from "../../components/selector/MultipleSelector";
import { TextArea } from "../../components/text-input/TextArea";
import { UserSelector } from "../../components/user-selector/UserSelector";
import { Checkbox } from "../../components/checkbox/Checkbox";

export const ResourcesPage: React.FC = React.memo(() => {
    const [date, setDate] = useState<Date | null>(null);
    const [select, setSelect] = useState("");
    const [user, setUser] = useState("");
    const [multi, setMulti] = useState<string[]>([]);
    const [radio, setRadio] = useState("");
    const [area, setArea] = useState("");
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [checkboxValue, setCheckbox] = useState(false);

    return (
        <Layout title={i18n.t("Resources")}>
            <Section title={"Components:"}>
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
                </Container>
                <Container width="300px">
                    <AvatarCard>Text</AvatarCard>
                </Container>
                <Container width="300px">
                    <DatePicker id={""} label="Date Picker" onChange={setDate} value={date} />
                </Container>
                <Container width="300px">
                    <TextInput
                        id={""}
                        label="Input Field"
                        value={input}
                        onChange={value => setInput(value)}
                    />
                </Container>
                <Container width="300px">
                    <MultipleSelector
                        id={""}
                        label="Multiple Selector"
                        selected={multi}
                        onChange={setMulti}
                        options={[
                            { value: "1", label: "value 1" },
                            { value: "2", label: "value 2" },
                        ]}
                    />
                </Container>
                <Container>
                    <RadioButtonsGroup
                        id={""}
                        label="Radio Buttons Group"
                        selected={radio}
                        onChange={value => setRadio(value)}
                        options={[
                            { value: "1", label: "value 1" },
                            { value: "2", label: "value 2" },
                        ]}
                    />
                </Container>
                <Container width="300px">
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
                    <TextArea id={""} label="Text Area" value={area} onChange={setArea} />
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
                <Container width="300px">
                    <Checkbox
                        id={""}
                        label="Checkbox"
                        checked={checkboxValue}
                        onChange={setCheckbox}
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
                <Container>
                    <UserSelector
                        id="User Selector"
                        label="User Selector"
                        selected={user}
                        onChange={setUser}
                        options={[
                            {
                                value: "1",
                                label: "value 1",
                                phone: "123456789",
                                email: "axample@example.com",
                                workPosition: "Director",
                                status: "available",
                            },
                            {
                                value: "2",
                                label: "value 2",
                                phone: "987654321",
                                email: "axample@example.com",
                                workPosition: "Director",
                                status: "available",
                            },
                        ]}
                    />
                </Container>
            </Section>
        </Layout>
    );
});

const Container = styled.div<{ width?: string }>`
    margin-block: 25px;
    display: flex;
    gap: 10px;
    width: ${props => props.width || "100%"};
    flex-wrap: wrap;
`;
