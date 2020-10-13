import BaseError from "./BaseError";

class HttpRequestError extends Error {
    constructor(public status: number, public message: string) {
        super();
    }
}
export default HttpRequestError;