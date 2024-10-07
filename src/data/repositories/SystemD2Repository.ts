import { D2Api } from "@eyeseetea/d2-api/2.36";
import { SystemRepository } from "../../domain/repositories/SystemRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { getDateAsLocaleDateTimeString } from "./utils/DateTimeHelper";

export class SystemD2Repository implements SystemRepository {
    constructor(private api: D2Api) {}

    public getLastAnalyticsRuntime(): FutureData<string> {
        return apiToFuture(this.api.system.info).map(info => {
            //TO DO : update d2Api repo to add lastAnalyticsTablePartitionSuccess to info
            //@ts-ignore
            if (info.lastAnalyticsTablePartitionSuccess)
                return getDateAsLocaleDateTimeString(
                    //@ts-ignore
                    new Date(info.lastAnalyticsTablePartitionSuccess)
                );
            else return "Unable to fetch last analytics runtime";
        });
    }
}
