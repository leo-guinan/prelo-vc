import telemetry from "telemetry-sh";

telemetry.init(process.env.TELEMETRY_API_KEY!);

export function logEvent(event: string, payload: Record<string, any>) {
    const combinedPayload = {
        ...payload,
        env: process.env.TELEMETRY_ENV,
        app: "PreloVC"
    }
    telemetry.log(event, combinedPayload);
}

export function logError(error: string) {
    const combinedPayload = {
        error: error,
        env: process.env.TELEMETRY_ENV,
        app: "PreloVC"
    }
    telemetry.log("error", combinedPayload);
}