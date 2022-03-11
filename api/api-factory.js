import v1Router from "./v1-router.js";


class APIFactoryError extends Error {
    constructor(invalidAPIVersion) {
        const msg = `Unknown API version ${invalidAPIVersion}, can't create router`;
        super(msg);
        this.name = "APIFactoryError";
    }
}

/**
 * Creates express.Router based on the API version
 * @param {string} apiVersion
 * @returns {(Express.Router|undefined)}
 */
export default function (apiVersion) {
    switch (apiVersion) {
        case "v1":
            return v1Router();
        default:
            throw new APIFactoryError(apiVersion);
    }
}
