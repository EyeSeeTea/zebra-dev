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
import {
    FilterType,
    StatisticTable,
    TableColumn,
} from "../../components/table/statistic-table/StatisticTable";
import { BasicTable, TableColumn as BasicTableColumn } from "../../components/table/BasicTable";

// TODO: REMOVE examples of this page
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

    const columns: TableColumn[] = [
        { label: "Event", value: "event" },
        { label: "Location", value: "location" },
        { label: "Cases", value: "cases" },
        { label: "Deaths", value: "deaths" },
        { label: "Duration", value: "duration" },
        { label: "Manager", value: "manager" },
        { label: "Detect 7d", dark: true, value: "detect7d" },
        { label: "Notify 1d", dark: true, value: "notify1d" },
        { label: "ERA1", value: "era1" },
        { label: "ERA2", value: "era2" },
        { label: "ERA3", value: "era3" },
        { label: "ERA4", value: "era4" },
        { label: "ERA5", value: "era5" },
        { label: "ERA6", value: "era6" },
        { label: "ERA7", value: "era7" },
        { label: "ERI", value: "eri" },
        { label: "Respond 7d", dark: true, value: "respond7d" },
    ];
    const editRiskAssessmentColumns = [
        "era1",
        "era2",
        "era3",
        "era4",
        "era5",
        "era6",
        "era7",
        "eri",
    ];
    const columnRules: { [key: string]: number } = {
        detect7d: 7,
        notify1d: 1,
        respond7d: 7,
    };
    const dataPerformanceOverview = [
        {
            event: "Cholera",
            location: "Northern",
            cases: "62",
            deaths: "34",
            duration: "4d",
            manager: "Paul Zulu",
            detect7d: "2",
            notify1d: "1",
            era1: "1",
            era2: "",
            era3: "",
            era4: "",
            era5: "",
            era6: "",
            era7: "",
            eri: "",
            respond7d: "",
        },
        {
            event: "Measles",
            location: "Western",
            cases: "112",
            deaths: "32",
            duration: "19d",
            manager: "Moses Mei",
            detect7d: "12",
            notify1d: "1",
            era1: "1",
            era2: "3",
            era3: "6",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Rabies",
            location: "Central",
            cases: "39",
            deaths: "12",
            duration: "13d",
            manager: "Tristin Go",
            detect7d: "6",
            notify1d: "3",
            era1: "6",
            era2: "7",
            era3: "7",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Polio",
            location: "Copperbelt",
            cases: "10",
            deaths: "3",
            duration: "18d",
            manager: "Lillie Lee",
            detect7d: "10",
            notify1d: "3",
            era1: "4",
            era2: "10",
            era3: "9",
            era4: "12",
            era5: "12",
            era6: "5",
            era7: "7",
            eri: "7",
            respond7d: "12",
        },
        {
            event: "Covid-19",
            location: "Lusaka",
            cases: "64",
            deaths: "32",
            duration: "14d",
            manager: "Jed Selma",
            detect7d: "7",
            notify1d: "1",
            era1: "1",
            era2: "7",
            era3: "7",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Covid-19",
            location: "North Western",
            cases: "64",
            deaths: "32",
            duration: "13d",
            manager: "Meg Amy",
            detect7d: "6",
            notify1d: "3",
            era1: "6",
            era2: "7",
            era3: "7",
            era4: "7",
            era5: "7",
            era6: "7",
            era7: "7",
            eri: "7",
            respond7d: "7",
        },
        {
            event: "Cholera",
            location: "Eastern",
            cases: "10",
            deaths: "3",
            duration: "17d",
            manager: "Mary Cole",
            detect7d: "10",
            notify1d: "3",
            era1: "4",
            era2: "10",
            era3: "9",
            era4: "12",
            era5: "12",
            era6: "5",
            era7: "7",
            eri: "7",
            respond7d: "12",
        },
    ];
    const filters: FilterType[] = [
        { value: "event", label: "Event", type: "multiselector" },
        // { value: "name", label: "Name", type: "multiselector" },
        // { value: "disease", label: "Disease", type: "multiselector" },
        { value: "location", label: "Location", type: "multiselector" },
        // { value: "dateRange", label: "Date range", type: "datepicker" },
    ];

    const columnsTeam: BasicTableColumn[] = [
        { value: "role", label: "Role", type: "text" },
        { value: "name", label: "Name", type: "link" },
        { value: "email", label: "Email", type: "link" },
        { value: "phone", label: "Phone", type: "text" },
    ];

    const dataTeam = [
        {
            role: "Incident Manager",
            name: "George Abitbol",
            email: "george.abitbol@gmail.com",
            phone: "+33 6 12 34 56 78",
        },
        {
            role: "Manager of Operations",
            name: "John Traore",
            email: "george.abitbol@gmail.com",
            phone: "+33 6 12 34 56 78",
        },
    ];

    const columnsResponseActions: BasicTableColumn[] = [
        { value: "mainTask", label: "Main Task", type: "text", underline: true },
        { value: "subActivities", label: "Sub Activities", type: "text" },
        { value: "subPillar", label: "Sub Pillar", type: "text" },
        { value: "responsibleOfficer", label: "Responsible officer", type: "text" },
        {
            value: "status",
            label: "Status",
            type: "selector",
            options: [
                { value: "Complete", label: "Complete" },
                { value: "Pending", label: "Pending" },
                { value: "In progress", label: "In progress" },
            ],
        },
        {
            value: "verification",
            label: "Verification",
            type: "selector",
            options: [
                { value: "Unverified", label: "Unverified" },
                { value: "Verified", label: "Verified" },
            ],
        },
        { value: "timeline", label: "Timeline", type: "text" },
        { value: "dueDate", label: "Due date", type: "text" },
    ];

    const dataResponseActions = [
        {
            mainTask: "Data management",
            subActivities: "Configure tablet",
            subPillar: "Planning",
            responsibleOfficer: "Moses Banda",
            status: "Complete",
            verification: "Unverified",
            timeline: "Qtr 2 June",
            dueDate: "8 June",
        },
        {
            mainTask: "Risk communication",
            subActivities: "Develop risk communication plan",
            subPillar: "RCCE",
            responsibleOfficer: "Mr Zimba",
            status: "Pending",
            verification: "Verified",
            timeline: "Qtr 3 June",
            dueDate: "17 June",
        },
        {
            mainTask: "Vaccine transportation",
            subActivities: "Reverse cold storage transport",
            subPillar: "Logistics",
            responsibleOfficer: "Mr Guissimon",
            status: "In progress",
            verification: "Unverified",
            timeline: "Qtr 3 June",
            dueDate: "9 June",
        },
        {
            mainTask: "Training of RRT",
            subActivities: "Train and deploy RRTs",
            subPillar: "Operations",
            responsibleOfficer: "Dr Chika",
            status: "Not done",
            verification: "Unverified",
            timeline: "Qtr 3 June",
            dueDate: "9 June",
        },
        {
            mainTask: "Supplies",
            subActivities: "Procure granular chlorine",
            subPillar: "Administration",
            responsibleOfficer: "Moses Banda",
            status: "Pending",
            verification: "Unverified",
            timeline: "Qtr 4 June",
            dueDate: "20 June",
        },
        {
            mainTask: "Supplies",
            subActivities: "Procure RDTs",
            subPillar: "Operations",
            responsibleOfficer: "Mpanga Kasonde",
            status: "In Progress",
            verification: "Unverified",
            timeline: "Qtr 3 June",
            dueDate: "17 June",
        },
        {
            mainTask: "Strengthen surveillance",
            subActivities: "Active case search",
            subPillar: "Surveillance",
            responsibleOfficer: "Namonda Mbumwae",
            status: "Complete",
            verification: "Unverified",
            timeline: "Qtr 1 June",
            dueDate: "5 June",
        },
    ];

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
                <Container>
                    <StatisticTable
                        columns={columns}
                        rows={dataPerformanceOverview}
                        filters={filters}
                        columnRules={columnRules}
                        editRiskAssessmentColumns={editRiskAssessmentColumns}
                    />
                </Container>
                <Container>
                    <BasicTable
                        showRowIndex
                        columns={columnsResponseActions}
                        rows={dataResponseActions}
                        onChange={() => {}}
                    />
                </Container>
                <Container>
                    <BasicTable columns={columnsTeam} rows={dataTeam} onChange={() => {}} />
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
