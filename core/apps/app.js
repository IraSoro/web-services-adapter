import express from "express";
import { getAppContext } from "../cfg.js";


class UnknownActionError extends Error {
    constructor(appName, unknownCommandName) {
        const msg = `Cannot found command ${unknownCommandName} in the ${appName} app`;
        super(msg);
        this.name = "UnknownActionError";
    }
}

class UnknownTriggerError extends Error {
    constructor(appName, unknownTriggerName) {
        const msg = `Cannot found trigger ${unknownTriggerName} in the ${appName} app`;
        super(msg);
        this.name = "UnknownTriggerError";
    }
}

class ActionOrTrigger {
    /**
     * @param {string} uuid - Universally unique identifier
     * @param {Object} ctx Application context (API Tokens and etc.)
     * @param {Object} args Specific arguments
     */
    constructor(uuid, ctx, args) {
        this._uuid = uuid;
        this._ctx = ctx;
        this._args = args;
    }

    /**
     * Callback parameter in the getFn returns value
     * 
     * @callback ResultCallback
     * @param {any} result
     * @param {any} error
     */

    /**
     * Function which returns from the getFn method
     * 
     * @callback CommandFunctionWithCallback
     * @param {ResultCallback} cb - A result callback
     */

    /**
     * Creates specific command
     * 
     * @return {CommandFunctionWithCallback} Command Function
     */
    getFn() {
    }
}

/**
 * Base app class
 */
class App {
    /**
     * @param {string} name Application name
     */
    constructor(name) {
        this._name = name;
        this._ctx = getAppContext(name);
        this._actions = {};
        this._triggers = {};
    }

    /**
     * Check if client already connected to the application
     * @returns {Boolean}
     */
    isAlreadyConnected() {
        return false;
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
     * Returns application router
     * @returns {Express.Router}
     */
    getRouter() {
        return new express.Router();
    }

    /**
     * Returns application triggers
     * @returns {Array.<string>}
     */
    getTriggers() {
        return (Object.keys(this._triggers));
    }

    /**
     * Returns application actions
     * @returns {Array.<string>}
     */
    getActions() {
        return (Object.keys(this._actions));
    }

    /**
     * Creates service trigger
     * @param {string} uuid - Universally unique identifier
     *
     * @param {Object} ctx - Context with trigger properties
     * @param {string} app - The name of the application whose trigger you want to create
     * @param {string} name - Name of the application trigger
     * @param {Object} args - Trigger specific arguments
     *
     * @returns {ActionOrTrigger}
     */
    createTrigger(uuid, ctx) {
        if (Object.keys(this._triggers).includes(ctx.name)) {
            return new this._triggers[ctx.name](uuid, this._ctx, ctx.args);
        }
        throw new UnknownTriggerError(this._name, ctx.name);
    }

    /**
     * Creates service action
     * @param {string} uuid - Universally unique identifier
     * 
     * @param {Object} ctx - Context with action properties
     * @param {string} app - The name of the application whose action you want to create
     * @param {string} name - Name of the application action
     * @param {Object} args - Action specific arguments
     * 
     * @returns {ActionOrTrigger}
     */
    createAction(uuid, ctx) {
        if (Object.keys(this._actions).includes(ctx.name)) {
            return new this._actions[ctx.name](uuid, this._ctx, ctx.args);
        }
        throw new UnknownActionError(this._name, ctx.name);
    }

    /**
     * Check service connection
     * @returns {Promise}
     */
    async check() {
    }
}

export {
    App,
    ActionOrTrigger as Trigger,
    ActionOrTrigger as Action
};
