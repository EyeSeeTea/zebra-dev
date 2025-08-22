import { Future } from "../../../domain/entities/generic/Future";
import { TrackerPostResponse } from "../../../types/d2-api";

type ErrorReport = {
    message: string;
    errorCode: string;
    trackerType: string;
    uid: string;
};

type TrackerPostErrorResponseData = {
    status: "ERROR";
    validationReport: {
        errorReports: ErrorReport[];
    };
};

type TrackerPostErrorResponse = {
    request: unknown;
    response: {
        data: TrackerPostErrorResponseData;
    };
};

export function parseTrackerPostErrorResponse(
    error: unknown,
    contextMessage: string
): Future<Error, TrackerPostResponse> {
    const maybeResponse = (error as TrackerPostErrorResponse)?.response?.data;
    if (
        maybeResponse?.status === "ERROR" &&
        Array.isArray(maybeResponse?.validationReport?.errorReports)
    ) {
        const errorReports = maybeResponse.validationReport.errorReports;
        const errorMessages = errorReports.map<string>((e: ErrorReport) => e.message).join(", ");
        return Future.error(new Error(`${contextMessage}: ${errorMessages}`));
    } else {
        return Future.error(new Error(`${contextMessage}: ${String(error)}`));
    }
}
