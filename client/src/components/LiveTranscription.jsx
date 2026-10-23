
    import { useEffect, useRef, useState } from "react";
    import { Mic, MicOff, Save, RotateCcw } from "lucide-react";
    import { saveTextTranscription } from "../services/api";
    import { toast } from 'react-toastify';

    const LiveTranscription = ({ onSaved }) => {
        const recognitionRef = useRef(null);
        const shouldListenRef = useRef(false);
        const [supported, setSupported] = useState(true);
        const [listening, setListening] = useState(false);
        const [saving, setSaving] = useState(false);
        const [title, setTitle] = useState(""); 
        const [language, setLanguage] = useState("en-IN");
        const [finalText, setFinalText] = useState("");
        const [interimText, setInterimText] = useState("");
        const [error, setError] = useState("");

        useEffect(() => {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                setSupported(false);
                return;
            }

            const recognition = new SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setListening(true);
                setError("");
            };

            recognition.onresult = (event) => {
                let newFinalText = "";
                let newInterimText = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        newFinalText += transcript + " ";
                    } else {
                        newInterimText += transcript;
                    }
                }

                if (newFinalText) {
                    setFinalText((previous) =>
                        `${previous}${newFinalText}`.replace(/\s+/g, " ")
                    );
                }

                setInterimText(newInterimText);
            };

            recognition.onerror = (event) => {
                if (event.error === "not-allowed" ||
                    event.error === "service-not-allowed") {
                    shouldListenRef.current = false;
                    setListening(false);
                    setError("Microphone permission was denied. Allow microphone access in your browser.");
                    return;
                }

                if (event.error !== "no-speech" && event.error !== "aborted") {
                    setError(`Speech recognition error: ${event.error}`);
                }
            };

            recognition.onend = () => {
                setListening(false);
                setInterimText("");
                if (shouldListenRef.current) {
                    try {
                        recognition.start();
                    } catch {
                        // A start already in progress can throw InvalidStateError.
                    }
                }
            };

            recognitionRef.current = recognition;

            return () => {
                shouldListenRef.current = false;
                recognition.onend = null;
                recognition.stop();
                recognitionRef.current = null;
            };
        }, [language]);

        const startListening = () => {
            if (!recognitionRef.current) return;

            setError("");
            setInterimText("");
            shouldListenRef.current = true;

            try {
                recognitionRef.current.start();
            } catch (err) {
                shouldListenRef.current = false;
                setError(
                    err.name === "InvalidStateError"
                        ? "Speech recognition is already starting. Please try again."
                        : "Could not start the microphone."
                );
            }
        };

        const stopListening = () => {
            shouldListenRef.current = false;
            recognitionRef.current?.stop();
            setListening(false);
            setInterimText("");
        };

        const clearTranscript = () => {
            stopListening();
            setFinalText("");
            setInterimText("");
            setTitle("");
            setError("");
        };

        const handleSave = async () => {
            const content = finalText.trim();

            if (!content) {
                setError("Speak something first, then save your transcript.");
                return;
            }

            try {
                setSaving(true);
                setError("");

                const saved = await saveTextTranscription({
                    title: title.trim() || "Live Transcription",
                    content,
                    language,
                });

                onSaved?.(saved);
                clearTranscript();
                toast.success('transcript saved');
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message ||
                    "Could not save the transcript. Check your backend and database."
                );
            } finally {
                setSaving(false);
            }
        };

        if (!supported) {
            return (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                    Live speech recognition is not supported in this browser.
                    Try a current version of Chrome or Edge.
                </section>
            );
        }

        return (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold">Live transcription</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Speak into your microphone and watch the text appear.
                        </p>
                    </div>

                    <label className="text-sm font-medium">
                        Recognition language
                        <select
                            value={language}
                            disabled={listening}
                            onChange={(event) => setLanguage(event.target.value)}
                            className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 sm:w-48"
                        >
                            <option value="hi-IN">Hindi (India)</option>
                            <option value="en-IN">English (India)</option>

                        </select>
                    </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                    {!listening ? (
                        <button
                            type="button"
                            onClick={startListening}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700"
                        >
                            <Mic size={18} />
                            Start microphone
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={stopListening}
                            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
                        >
                            <MicOff size={18} />
                            Stop recording
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={clearTranscript}
                        disabled={saving || listening || (!finalText && !interimText)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                        <RotateCcw size={17} />
                        Clear
                    </button>
                </div>
                <div
                    aria-live="polite"
                    className="mt-4 min-h-36 whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7"
                >
                    {finalText}
                    {interimText && (
                        <span className="text-slate-400"> {interimText}</span>
                    )}
                    {!finalText && !interimText && (
                        <span className="text-slate-400">
                            {listening
                                ? "Listening… start speaking."
                                : "Your recognized speech will appear here."}
                        </span>
                    )}
                </div>

                <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <p className="text-xs text-slate-500">
                        {listening ? "Microphone active" : "Microphone stopped"} ·
                        {" "}{finalText.trim().split(/\s+/).filter(Boolean).length} words finalized
                    </p>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || listening || !finalText.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save transcript"}
                    </button>
                </div>

                {error && (
                    <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}
            </section>
        );
    };

    export default LiveTranscription;
