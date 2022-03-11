import fs from "fs";
import process from "process";
import express from "express";
import { parse } from "path";


export default function () {
    /* NOTE @imblowfish: Маршрут, который вызывается, если другие не сработали,
     * Проверяет наличие запрашиваемого файла в public директории, если файл есть
     * возвращает его, иначе возвращает главную страницу, на которой уже срабатывает
     * react-router-dom и вызывает нужный виртуальный Route по url
     */
    const router = new express.Router();

    router.use(async (req, res) => {
        const __dirname = process.cwd();
        const staticDirFilePath = `${__dirname}/public/${parse(req.url).base}`;
        try {
            await fs.promises.access(staticDirFilePath);
            res.sendFile(staticDirFilePath);
        } catch (err) {
            res.sendFile(__dirname + "/public/index.html");
        }
    });

    return router;
};
