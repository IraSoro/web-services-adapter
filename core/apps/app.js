import express from "express";

import { cfgManager } from "../cfg-manager.js";


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

/**
 * Base command class
 */
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
    /**
     * @param {string} name Application name
     */
    constructor(name) {
        this._name = name;
        this._ctx = cfgManager.getAppContext(name);
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
     * Creates service trigger
     * @param {string} triggerName 
     * @param {string} args
     * @returns {Command}
     */
    createTrigger(triggerName, args) {
        triggerName;
        args;
    }

    /**
     * Creates service command
     * @param {string} commandName 
     * @param {string} args
     * @returns {Command}
     */
    createCommand(commandName, args) {
        commandName;
        args;
    }

    /**
     * Check service connection
     * @returns {Promise}
     */
    async check() {
    }
}
