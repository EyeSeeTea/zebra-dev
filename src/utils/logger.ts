import { ConsoleLogger, ProgramLogger, initLogger, BatchLogContent } from "@eyeseetea/d2-logger";
import { Instance } from "../data/entities/Instance";
import { Id } from "../domain/entities/Ref";
import { RTSL_ZEBRA_ORG_UNIT_ID } from "../data/repositories/consts/DiseaseOutbreakConstants";

const LOGS_PROGRAM = "usU7YBzuhaE";
const MESSAGE_DATA_ELEMENT = "OCXD513wyZU";
const MESSAGE_TYPE_DATA_ELEMENT = "UF08oi330lh";

export let logger: ProgramLogger | ConsoleLogger;
export type { BatchLogContent };

export async function setupLogger(
    instance: Instance,
    options?: { isDebug?: boolean; orgUnitId?: Id }
): Promise<void> {
    const { isDebug = false, orgUnitId } = options ?? {};

    logger = await initLogger({
        type: "program",
        debug: isDebug,
        baseUrl: instance.url,
        auth: instance.auth,
        programId: LOGS_PROGRAM,
        organisationUnitId: orgUnitId || RTSL_ZEBRA_ORG_UNIT_ID,
        dataElements: {
            messageId: MESSAGE_DATA_ELEMENT,
            messageTypeId: MESSAGE_TYPE_DATA_ELEMENT,
        },
    });
}

export async function setupLoggerForTesting(): Promise<void> {
    logger = await initLogger({
        type: "console",
    });
}
