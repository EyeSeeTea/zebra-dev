import { CasesDataSource } from "../../../domain/entities/disease-outbreak-event/DiseaseOutbreakEvent";
import { Future } from "../../../domain/entities/generic/Future";
import { MapConfig, MapKey } from "../../../domain/entities/MapConfig";
import { MapConfigRepository } from "../../../domain/repositories/MapConfigRepository";
import { FutureData } from "../../api-futures";

export class MapConfigTestRepository implements MapConfigRepository {
    public get(_mapKey: MapKey, _casesDataSource?: CasesDataSource): FutureData<MapConfig> {
        return Future.success({
            currentApp: "ZEBRA",
            currentPage: "DASHBOARD",
            mapId: "HuCCj3yRQDW",
            programId: "MQtbs8UkBxy",
            programName: "RTSL_ZEBRA_ALERTS",
            startDate: "2000-01-01",
            timeField: "ENROLLMENT_DATE",
            programIndicators: [
                {
                    id: "OJo5mx3WSDj",
                    name: "# of active verified",
                    disease: "ALL",
                    hazardType: "ALL",
                    incidentStatus: "ALL",
                },
                {
                    id: "shDqMOCI67z",
                    name: "# of active verified - Watch",
                    disease: "ALL",
                    hazardType: "ALL",
                    incidentStatus: "Watch",
                },
                {
                    id: "PHhaZK4KeOA",
                    name: "# of active verified - Alert",
                    disease: "ALL",
                    hazardType: "ALL",
                    incidentStatus: "Alert",
                },
                {
                    id: "e2LtQdabQRv",
                    name: "# of active verified - Respond",
                    disease: "ALL",
                    hazardType: "ALL",
                    incidentStatus: "Respond",
                },
                {
                    id: "koyK0jI9IS6",
                    name: "# of active verified - Acute respiratory",
                    disease: "Acute respiratory",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "X9DtagMllHF",
                    name: "# of active verified - Acute VHF",
                    disease: "Acute VHF",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "s46w5UXnmXB",
                    name: "# of active verified - AFP",
                    disease: "AFP",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "MzR4s9k6Ne8",
                    name: "# of active verified - Anthrax",
                    disease: "Anthrax",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "GvAXv7mcBD0",
                    name: "# of active verified - Bacterial meningitis",
                    disease: "Bacterial meningitis",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "DtiXRURD4ZO",
                    name: "# of active verified - Cholera",
                    disease: "Cholera",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "TqpD8J4QLiY",
                    name: "# of active verified - COVID19",
                    disease: "COVID19",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "Rs3VYVCPGah",
                    name: "# of active verified - Diarrhoea with blood",
                    disease: "Diarrhoea with blood",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "zwYANHwcJJN",
                    name: "# of active verified - Measles",
                    disease: "Measles",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "BUHp1iUlRz9",
                    name: "# of active verified - Monkeypox",
                    disease: "Monkeypox",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "Uk8xG5QfShd",
                    name: "# of active verified - Neonatal tetanus",
                    disease: "Neonatal tetanus",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "GX4Qo2Y40eA",
                    name: "# of active verified - Plague",
                    disease: "Plague",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "As9Hp478vFJ",
                    name: "# of active verified - SARIs",
                    disease: "SARIs",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "dbikN79NQNz",
                    name: "# of active verified - Typhoid fever",
                    disease: "Typhoid fever",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "xJpA1n03N5W",
                    name: "# of active verified - Zika fever",
                    disease: "Zika fever",
                    hazardType: null,
                    incidentStatus: "ALL",
                },
                {
                    id: "SGGbbu0AKUv",
                    name: "# of active verified - Acute respiratory - Watch",
                    disease: "Acute respiratory",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "QnhsQnEsp1p",
                    name: "# of active verified - Acute respiratory - Alert",
                    disease: "Acute respiratory",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "Rt5KNVqBEO7",
                    name: "# of active verified - Acute respiratory - Respond",
                    disease: "Acute respiratory",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "bcI9Rmx2ycH",
                    name: "# of active verified - Acute VHF - Watch",
                    disease: "Acute VHF",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "u4XTtjm9nEh",
                    name: "# of active verified - Acute VHF - Alert",
                    disease: "Acute VHF",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "gpKelVBHhRZ",
                    name: "# of active verified - Acute VHF - Respond",
                    disease: "Acute VHF",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "pqob28cwd3i",
                    name: "# of active verified - AFP - Watch",
                    disease: "AFP",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "XqhZBwAzyhZ",
                    name: "# of active verified - AFP - Alert",
                    disease: "AFP",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "SyemUCen8zf",
                    name: "# of active verified - AFP - Respond",
                    disease: "AFP",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "YPPhLHgwiKV",
                    name: "# of active verified - Anthrax - Watch",
                    disease: "Anthrax",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "FhdaufdE8l3",
                    name: "# of active verified - Anthrax - Alert",
                    disease: "Anthrax",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "vuhm2b5D076",
                    name: "# of active verified - Anthrax - Respond",
                    disease: "Anthrax",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "qeQSDdPTeVq",
                    name: "# of active verified - Bacterial meningitis - Watch",
                    disease: "Bacterial meningitis",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "WXlyJHUKI8T",
                    name: "# of active verified - Bacterial meningitis - Alert",
                    disease: "Bacterial meningitis",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "DCwOujun1ED",
                    name: "# of active verified - Bacterial meningitis - Respond",
                    disease: "Bacterial meningitis",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "zNctWJj7Ncl",
                    name: "# of active verified - Cholera - Watch",
                    disease: "Cholera",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "U31oe2BwJtt",
                    name: "# of active verified - Cholera - Alert",
                    disease: "Cholera",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "WCrE9mP80q4",
                    name: "# of active verified - Cholera - Respond",
                    disease: "Cholera",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "m2LBISybVDA",
                    name: "# of active verified - COVID19 - Watch",
                    disease: "COVID19",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "sY5lGlHpcuN",
                    name: "# of active verified - COVID19 - Alert",
                    disease: "COVID19",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "LQ128PeTF8x",
                    name: "# of active verified - COVID19 - Respond",
                    disease: "COVID19",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "oKSsu6q3MJW",
                    name: "# of active verified - Diarrhoea with blood - Watch",
                    disease: "Diarrhoea with blood",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "EgGc7XxZjmC",
                    name: "# of active verified - Diarrhoea with blood - Alert",
                    disease: "Diarrhoea with blood",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "uAMXUxp3XBa",
                    name: "# of active verified - Diarrhoea with blood - Respond",
                    disease: "Diarrhoea with blood",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "yesuR8ho9vY",
                    name: "# of active verified - Measles - Watch",
                    disease: "Measles",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "OvxA9yqaH7q",
                    name: "# of active verified - Measles - Alert",
                    disease: "Measles",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "q9HlUfaQj3p",
                    name: "# of active verified - Measles - Respond",
                    disease: "Measles",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "mw7Qxti6Fk5",
                    name: "# of active verified - Monkeypox - Watch",
                    disease: "Monkeypox",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "kMsSxdZMqJV",
                    name: "# of active verified - Monkeypox - Alert",
                    disease: "Monkeypox",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "qL6WGfcoh1l",
                    name: "# of active verified - Monkeypox - Respond",
                    disease: "Monkeypox",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "eo2RAoIRYiV",
                    name: "# of active verified - Neonatal tetanus - Watch",
                    disease: "Neonatal tetanus",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "EuIc8gJYAhP",
                    name: "# of active verified - Neonatal tetanus - Alert",
                    disease: "Neonatal tetanus",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "H7Fmb58GUF9",
                    name: "# of active verified - Neonatal tetanus - Respond",
                    disease: "Neonatal tetanus",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "IYktWOGBTtj",
                    name: "# of active verified - Plague - Watch",
                    disease: "Plague",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "qdLWFsb7Ghk",
                    name: "# of active verified - Plague - Alert",
                    disease: "Plague",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "nbG4Lnl1JUz",
                    name: "# of active verified - Plague - Respond",
                    disease: "Plague",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "fEdwx7X6BLI",
                    name: "# of active verified - SARIs - Watch",
                    disease: "SARIs",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "FSstKrL8oys",
                    name: "# of active verified - SARIs - Alert",
                    disease: "SARIs",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "SkkAznpVZzr",
                    name: "# of active verified - SARIs - Respond",
                    disease: "SARIs",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "JcfEcfD64Gy",
                    name: "# of active verified - Typhoid fever - Watch",
                    disease: "Typhoid fever",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "wfsBvSq7Hn1",
                    name: "# of active verified - Typhoid fever - Alert",
                    disease: "Typhoid fever",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "FMKLwKkOUzx",
                    name: "# of active verified - Typhoid fever - Respond",
                    disease: "Typhoid fever",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "XieBgoffFRd",
                    name: "# of active verified - Zika fever - Watch",
                    disease: "Zika fever",
                    hazardType: null,
                    incidentStatus: "Watch",
                },
                {
                    id: "tIYANWCiMoR",
                    name: "# of active verified - Zika fever - Alert",
                    disease: "Zika fever",
                    hazardType: null,
                    incidentStatus: "Alert",
                },
                {
                    id: "qJjRR8EwYgB",
                    name: "# of active verified - Zika fever - Respond",
                    disease: "Zika fever",
                    hazardType: null,
                    incidentStatus: "Respond",
                },
                {
                    id: "wK8Z7XvjUcC",
                    name: "# of active verified - Animal type",
                    disease: null,
                    hazardType: "Biological: Animal",
                    incidentStatus: "ALL",
                },
                {
                    id: "pmXUt3YWXO1",
                    name: "# of active verified - Human type",
                    disease: null,
                    hazardType: "Biological: Human",
                    incidentStatus: "ALL",
                },
                {
                    id: "It2z7nRoYn1",
                    name: "# of active verified - Human and Animal type",
                    disease: null,
                    hazardType: "Biological: Human and Animal",
                    incidentStatus: "ALL",
                },
                {
                    id: null,
                    name: null,
                    disease: null,
                    hazardType: "Chemical (Bio-warfare)",
                    incidentStatus: "ALL",
                },
                {
                    id: "Xec7fRcZ1wy",
                    name: "# of active verified - Environmental type",
                    disease: null,
                    hazardType: "Environmental",
                    incidentStatus: "ALL",
                },
                {
                    id: "gMoRiHe1Z0Z",
                    name: "# of active verified - Animal type - Watch",
                    disease: null,
                    hazardType: "Biological: Animal",
                    incidentStatus: "Watch",
                },
                {
                    id: "tKLdMcWUg9l",
                    name: "# of active verified - Animal type - Alert",
                    disease: null,
                    hazardType: "Biological: Animal",
                    incidentStatus: "Alert",
                },
                {
                    id: "TJhGnX8E7CP",
                    name: "# of active verified - Animal type - Respond",
                    disease: null,
                    hazardType: "Biological: Animal",
                    incidentStatus: "Respond",
                },
                {
                    id: "YfkOUZPhCY1",
                    name: "# of active verified - Human type - Watch",
                    disease: null,
                    hazardType: "Biological: Human",
                    incidentStatus: "Watch",
                },
                {
                    id: "NzpH7Y76JBw",
                    name: "# of active verified - Human type - Alert",
                    disease: null,
                    hazardType: "Biological: Human",
                    incidentStatus: "Alert",
                },
                {
                    id: "jWDbWYr85DP",
                    name: "# of active verified - Human type - Respond",
                    disease: null,
                    hazardType: "Biological: Human",
                    incidentStatus: "Respond",
                },
                {
                    id: "kLtsjiyIzer",
                    name: "# of active verified - Human and Animal type - Watch",
                    disease: null,
                    hazardType: "Biological: Human and Animal",
                    incidentStatus: "Watch",
                },
                {
                    id: "ge4Jwq2MGrF",
                    name: "# of active verified - Human and Animal type - Alert",
                    disease: null,
                    hazardType: "Biological: Human and Animal",
                    incidentStatus: "Alert",
                },
                {
                    id: "GQ6Yg9ZN4xL",
                    name: "# of active verified - Human and Animal type - Respond",
                    disease: null,
                    hazardType: "Biological: Human and Animal",
                    incidentStatus: "Respond",
                },
                {
                    id: null,
                    name: null,
                    disease: null,
                    hazardType: "Chemical (Bio-warfare)",
                    incidentStatus: "Watch",
                },
                {
                    id: null,
                    name: null,
                    disease: null,
                    hazardType: "Chemical (Bio-warfare)",
                    incidentStatus: "Alert",
                },
                {
                    id: null,
                    name: null,
                    disease: null,
                    hazardType: "Chemical (Bio-warfare)",
                    incidentStatus: "Respond",
                },
                {
                    id: "Bu4bafAjFXN",
                    name: "# of active verified - Environmental type - Watch",
                    disease: null,
                    hazardType: "Environmental",
                    incidentStatus: "Watch",
                },
                {
                    id: "z3EbI98pgjG",
                    name: "# of active verified - Environmental type - Alert",
                    disease: null,
                    hazardType: "Environmental",
                    incidentStatus: "Alert",
                },
                {
                    id: "gRcZNqpKyYg",
                    name: "# of active verified - Environmental type - Respond",
                    disease: null,
                    hazardType: "Environmental",
                    incidentStatus: "Respond",
                },
            ],
            zebraNamespace: "zebra",
            dashboardDatastoreKey: "active-verified-alerts-program-indicators",
        } as MapConfig);
    }
}
