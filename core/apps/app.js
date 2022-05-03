import express from "express";
import { getAppContext } from "../cfg.js";


export class UnknownCommandError extends Error {
    constructor(appName, unknownCommandName) {
        const msg = `Cannot found command ${unknownCommandName} in the ${appName} app`;
        super(msg);
        this.name = "UnknownCommandError";
    }
}

export class UnknownTriggerError extends Error {
    constructor(appName, unknownTriggerName) {
        const msg = `Cannot found trigger ${unknownTriggerName} in the ${appName} app`;
        super(msg);
        this.name = "UnknownTriggerError";
    }
}

export class Command {
    /**
     * @param {Object} ctx Context with service parameters (API Tokens and etc.)
     * @param {Object} args Command arguments
     */
    constructor(ctx, args) {
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
export class App {
    /**
     * @param {string} name Application name
     */
    constructor(name) {
        this._name = name;
        this._ctx = getAppContext(name);
        this._commands = {};
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
     * Returns application commands
     * @returns {Array.<string>}
     */
    getCommands() {
        return (Object.keys(this._commands));
    }

    /**
     * Creates service trigger
     * @param {string} triggerName 
     * @param {string} args
     * @returns {Command}
     */
    createTrigger(triggerName, args) {
        if (Object.keys(this._triggers).includes(triggerName)) {
            return new this._triggers[triggerName](this._ctx, args);
        }
        throw new UnknownTriggerError(this._name, triggerName);
    }

    /**
     * Creates service command
     * @param {string} commandName 
     * @param {string} args
     * @returns {Command}
     */
    createCommand(commandName, args) {
        if (Object.keys(this._commands).includes(commandName)) {
            return new this._commands[commandName](this._ctx, args);
        }
        throw new UnknownCommandError(this._name, commandName);
    }

    /**
     * Check service connection
     * @returns {Promise}
     */
    async check() {
    }
}
