/**
 * Base command class
 */
export class Command {
    constructor(ctx, args) {
        this._ctx = ctx;
        this._args = args;
    }

    /**
     * Command execution
     * @returns {Promise}
     */
    async exec() {
    }
}

/**
 * Base app class
 */
export class App {
    constructor(ctx) {
        this._ctx = ctx;
    }

    /**
     * Return authorization type
     * @returns {string} OAuth2, APIToken or None
     */
    getAuthType() {
    }

    /**
     * Return OAuth2 authorization URL
     * @returns {string}
     */
    getAuthURL() {
    }

    /**
     * Creates service trigger
     * @param {string} name 
     * @param {string} args
     * @returns {Command}
     */
    createTrigger(name, args) {
        name;
        args;
    }

    /**
     * Creates service command
     * @param {string} name 
     * @param {string} args
     * @returns {Command}
     */
    createCommand(name, args) {
        name;
        args;
    }
    
    /**
     * Service authorization step
     * @param {string} callback Authorization callback with authorization URL parameter
     * @returns {Promise}
     */
    async auth(callback) {
        callback;
    }

    /**
     * Check service connection
     * @returns {Promise}
     */
    async check() {
    }
}
