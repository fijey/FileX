import type { ApiResponse } from "../../domain/types/response/response.types";

export class ResponseFormatter {
    static success<T>(status: number, message: string, data?: T): ApiResponse<T> {
        return {
            status,
            message,
            data
        };
    }
    static error(status: number, message: string, error: string): ApiResponse<null> {
        return {
            status,
            message,
            error
        };
    }
}