import { D2Api } from "@eyeseetea/d2-api/2.36";
import { SystemRepository } from "../../domain/repositories/SystemRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { getDateAsLocaleDateTimeString } from "./utils/DateTimeHelper";
import "moment-timezone";
import moment from "moment";

export class SystemD2Repository implements SystemRepository {
    constructor(private api: D2Api) {}

    public getLastAnalyticsRuntime(): FutureData<string> {
        return apiToFuture(this.api.system.info).map(info => {
            //TO DO : update d2Api repo to add lastAnalyticsTablePartitionSuccess to info

            //@ts-ignore
            const lastAnalyticsTablePartitionSuccess = info.lastAnalyticsTablePartitionSuccess;

            //If continious analytics is turned on, return it.
            if (lastAnalyticsTablePartitionSuccess) {
                const lastAnalyticsTablePartitionSuccessUTCString = moment
                    .tz(lastAnalyticsTablePartitionSuccess, info.serverTimeZoneId)
                    .utc()
                    .toString();

                return getDateAsLocaleDateTimeString(lastAnalyticsTablePartitionSuccessUTCString);
            } else {
                return "Unable to fetch last analytics runtime";
            }
        });
    }
}
