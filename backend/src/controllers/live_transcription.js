const  prisma = require("../lib/prisma")
const saveLiveTranscription = async (req, res) => {
    try {
        const { title, content, language } = req.body;

        if (typeof content !== "string" || !content.trim()) {
            return res.status(400).json({
                message: "Transcript content is required.",
            });
        }

        const transcription = await prisma.transcription.create({
            data: {
                title:
                    typeof title === "string" && title.trim()
                        ? title.trim()
                        : "Live Transcription",
                content: content.trim(),
                language:
                    typeof language === "string" && language.trim()
                        ? language.trim()
                        : "auto",
            },
        });

        return res.status(201).json(transcription);
    } catch (error) {
        console.error("Saving live transcription failed:", error);

        return res.status(500).json({
            message: "Could not save live transcription.",
        });
    }
};

const updateTranscription = async (req, res) => {
    
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof content !== "string" ||
            !content.trim()
        ) {
            return res.status(400).json({
                message: "Title and transcript text are required.",
            });
        }

        const updated = await prisma.transcription.update({
            where: { id },
            data: {
                title: title.trim(),
                content: content.trim(),
            },
        });

        return res.status(200).json(updated);
    } catch (error) {
        console.error("Update transcription error:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Transcription not found.",
            });
        }

        return res.status(500).json({
            message: "Could not update the transcript.",
        });
    }
};

const deleteTranscription = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.transcription.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Transcription deleted successfully",
        });
    } catch (error) {
        console.error("Delete transcription error:", error);

        if (error.code === "P2025") {
            return res.status(404).json({
                message: "Transcription not found",
            });
        }

        return res.status(500).json({
            message: "Failed to delete transcription",
        });
    }
};

module.exports = { saveLiveTranscription, updateTranscription, deleteTranscription }
