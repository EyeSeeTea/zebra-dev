import { PerformanceMetrics717 } from "../../../domain/entities/disease-outbreak-event/PerformanceOverviewMetrics";
import { Future } from "../../../domain/entities/generic/Future";
import { OverviewCard } from "../../../domain/entities/PerformanceOverview";
import { Id } from "../../../domain/entities/Ref";
import { PerformanceOverviewRepository } from "../../../domain/repositories/PerformanceOverviewRepository";
import { FutureData } from "../../api-futures";

export class PerformanceOverviewTestRepository implements PerformanceOverviewRepository {
    getEventTracker717Performance(
        _diseaseOutbreakEventId: Id
    ): FutureData<PerformanceMetrics717[]> {
        return Future.success([]);
    }
    getEventTrackerOverviewMetrics(): FutureData<OverviewCard[]> {
        throw Future.success([]);
    }
    getTotalCardCounts(): FutureData<any> {
        return Future.success(0);
    }
    getDashboard717Performance(): FutureData<any> {
        return Future.success(0);
    }

    getPerformanceOverviewMetrics(): FutureData<any[]> {
        return Future.success([
            {
                id: "JPenxAnjdhY",
                manager: "user, dev (dev.user)",
                creationDate: "2024-08-27 11:07:48.68",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Cholera",
                event: "test event",
                era1: "",
                era2: "",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "",
                detect7d: "",
                notify1d: "",
            },
            {
                id: "oHSPSlkb7J5",
                manager: "user, dev (dev.user)",
                creationDate: "2024-08-26 17:03:17.532",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Acute respiratory",
                event: "test event",
                era1: "",
                era2: "",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "",
                detect7d: "",
                notify1d: "",
            },
            {
                id: "g5C6Veut61t",
                manager: "user, dev (dev.user)",
                creationDate: "2024-08-27 11:06:36.869",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Acute VHF",
                event: "test event",
                era1: "",
                era2: "",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "",
                detect7d: "",
                notify1d: "",
            },
            {
                id: "EtoUrZCn8mP",
                manager: "user, dev (dev.user)",
                creationDate: "2024-08-22 15:12:06.016",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "COVID19",
                event: "Cholera Aug 2024",
                era1: "15",
                era2: "14",
                era3: "",
                era4: "14",
                era5: "",
                era6: "",
                era7: "14",
                detect7d: "2",
                notify1d: "1",
            },
            {
                id: "HNiwOkH3vdJ",
                manager: "user, dev (dev.user)",
                creationDate: "2024-08-22 13:29:27.734",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Anthrax",
                event: "Anthrax July 2024",
                era1: "29",
                era2: "28",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "17",
                detect7d: "10",
                notify1d: "21",
            },
            {
                id: "qrezSaY5G0U",
                manager: "user, dev (dev.user)",
                creationDate: "2024-08-22 13:25:24.505",
                province: "zm Zambia Ministry of Health",
                suspectedDisease: "Measles",
                event: "Measles June 2024",
                era1: "63",
                era2: "55",
                era3: "",
                era4: "",
                era5: "",
                era6: "",
                era7: "53",
                detect7d: "3",
                notify1d: "2",
            },
        ]);
    }
}
