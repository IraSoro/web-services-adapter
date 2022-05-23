import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getConfig } from "../core/cfg.js";


export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePasswordAndHash(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}

function signToken(userId, secretKey, expiresIn) {
    return new Promise((resolve, reject) => {
        const opts = {
            issuer: "http://localhost",
            audience: userId,
            expiresIn: expiresIn
        };
        jwt.sign({}, secretKey, opts, (err, token) => {
            if (err) {
                return reject(err);
            }
            resolve(token);
        });
    });
}

export function signAccessToken(userId) {
    return signToken(userId, getConfig("Auth").secret, "1h");
}

export function signRefreshToken(userId) {
    return signToken(userId, getConfig("Auth").secret, "60d");
}

export function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getConfig("Auth").secret, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
}
