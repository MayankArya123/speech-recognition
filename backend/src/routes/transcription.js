const express = require("express");
const prisma = require("../lib/prisma.js");
const router = express.Router();
const { saveLiveTranscription,deleteTranscription,updateTranscription} = require('../controllers/live_transcription.js')
router.get("/", async (req, res) => {
    try {
        const transcriptions = await prisma.transcription.findMany({
            orderBy: { createdAt: "desc" },
        });

        res.json(transcriptions);
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({
            message: "Failed to fetch transcriptions",
        });
    }
});

router.put("/:id", updateTranscription);

router.post("/text", saveLiveTranscription);

router.delete("/:id", deleteTranscription);

module.exports = router
