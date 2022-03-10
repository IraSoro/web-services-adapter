import express from "express";

import { cfgManager } from "../cfg-manager.js";


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
     * Check service connection
     * @returns {Promise}
     */
    async check() {
    }
}
