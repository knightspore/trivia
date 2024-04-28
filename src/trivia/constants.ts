import type { APIResponseCode } from "./types"

export const BASE_URL = "https://opentdb.com"
export const API_PATH = "/api.php"

export const APIErrorMessages: Record<APIResponseCode, string> = {
    0: "Success",
    1: "No Results",
    2: "Invalid Parameter",
    3: "Token Not Found",
    4: "Token Empty"
}
