import { isElementOfUnion, UnionFromValues } from "../../utils/ts-utils";

const logLevels = ["debug", "info", "warn", "error"] as const;
export type LogLevel = UnionFromValues<typeof logLevels>;

const levelFromEnv =
    typeof process !== "undefined" && process.env && process.env["LOG_LEVEL"]
        ? process.env["LOG_LEVEL"]
        : "";
const level = isElementOfUnion(levelFromEnv, logLevels) ? levelFromEnv : "info";
const levelIndex = logLevels.indexOf(level);

function getLogger(logLevelIndex: number, level: LogLevel) {
    return function writer(message: string) {
        if (
            logLevelIndex >= levelIndex &&
            typeof process !== "undefined" &&
            process.stderr?.write
        ) {
            const ts = new Date().toISOString().split(".")[0]?.replace("T", " ");
            process.stderr.write(`[${level.toUpperCase()}] [${ts}] ${message}\n`);
        }
    };
}

const consoleLogger = {
    debug: getLogger(0, "debug"),
    info: getLogger(1, "info"),
    warn: getLogger(2, "warn"),
    error: getLogger(3, "error"),
};

export default consoleLogger;
