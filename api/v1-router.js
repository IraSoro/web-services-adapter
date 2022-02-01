import express from "express";


export default function () {
    const router = express.Router();

    router.get("/", (_, res) => {
        res.json({ res: "Success" });
    });

    return router;
}
