import v1Router from "./v1-router.js";

/**
 * Creates express.Router based on the API version
 * @param {string} apiVersion
 * @returns {(express.Router|undefined)}
 */
export default function (apiVersion) {
    switch (apiVersion) {
        case "v1":
            return v1Router();
        default:
            throw `Error: Unknown API version ${apiVersion} cannot create router`;
    }
}
