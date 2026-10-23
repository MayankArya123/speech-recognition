import { useState, useMemo, useEffect } from "react";
import {
    getTranscriptions,
    deleteTranscription,
    updateTranscription
} from "../services/api";
import {
    AudioLines,
    FileText,
    Pencil,
    Trash2,
    Search,
} from "lucide-react";
import { toast } from "react-toastify";


export const TranscriptionHistory = () => {

    const emptyForm = {
        title: "",
        audio: null,
    };

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [transcriptions, setTranscriptions] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        content: "",
    });
    const [updating, setUpdating] = useState(false);
    const openCreateForm = () => {
        setError("");
        setForm({ ...emptyForm });
        setShowForm(true);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editForm.title.trim() || !editForm.content.trim()) {
            setError("Title and transcript text are required.");
            return;
        }

        try {
            setUpdating(true);
            setError("");

            const updated = await updateTranscription(editingId, {
                title: editForm.title.trim(),
                content: editForm.content.trim(),
            });

            setTranscriptions((current) =>
                current.map((item) =>
                    item.id === editingId ? { ...item, ...updated } : item
                )
            );

            setEditingId(null);
            setEditForm({ title: "", content: "" });
            toast.success('transcription updated')
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Could not update the transcript."
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transcript?")) {
            return;
        }

        try {
            setError("");
            setDeletingId(id);

            await deleteTranscription(id);

            setTranscriptions((current) =>
                current.filter((item) => item.id !== id)
            );
        } catch (err) {
            console.error(err);
            setError("Could not delete the transcript.");
        } finally {
            setDeletingId(null);
        }
    };

    const openEditForm = (item) => {
        setError("");
        setEditingId(item.id);
        setEditForm({
            title: item.title || "",
            content: item.content || "",
        });
    };

    const loadTranscriptions = async () => {
        try {
            setError("");
            const data = await getTranscriptions();
            setTranscriptions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(
                "Could not load transcripts. Check your backend and database connection."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTranscriptions();
    }, []);


    const filteredTranscriptions = useMemo(() => {
        const query = search.toLowerCase().trim();

        return transcriptions.filter((item) => {
            const title = String(item.title ?? "").toLowerCase();
            const content = String(item.content ?? "").toLowerCase();

            return title.includes(query) || content.includes(query);
        });
    }, [transcriptions, search]);

    return <div className="w-[96%] mx-auto mt-4" >

        <section>
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold">
                        Recent transcripts
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Your saved transcription history
                    </p>
                </div>

                <div className="relative w-full sm:max-w-xs">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search transcripts..."
                        aria-label="Search transcripts"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
            </div>
        </section>

        {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
                Loading transcripts...
            </div>
        ) : filteredTranscriptions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <AudioLines size={26} />
                </div>

                <h3 className="font-semibold">
                    {search
                        ? "No matching transcripts"
                        : "No transcripts yet"}
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                    {search
                        ? "Try a different search term."
                        : "Upload an audio file to generate your first transcript."}
                </p>

                {!search && (
                    <button
                        onClick={openCreateForm}
                        className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Upload audio
                    </button>
                )}
            </div>
        ) : (
            <div className="space-y-4">
                {filteredTranscriptions.map((item) => (
                    <article
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <FileText size={21} />
                                </div>

                                <div className="min-w-0">
                                    <h3 className="break-words font-semibold">
                                        {item.title || "Untitled Transcription"}
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Language: {item.language || "Auto"}
                                        {item.createdAt &&
                                            ` · ${new Date(
                                                item.createdAt
                                            ).toLocaleString()}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => openEditForm(item)}
                                    aria-label={`Edit ${item.title || "transcript"}`}
                                    title="Edit transcript"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    aria-label={`Delete ${item.title || "transcript"}`}
                                    title="Delete transcript"
                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                            {item.content || "No transcript text available."}
                        </p>
                    </article>
                ))}
            </div>
        )}

        {editingId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
                <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
                    <h2 className="text-xl font-bold">Edit transcription</h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Update the saved title or transcript text.
                    </p>

                    <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                        <div>
                            <label
                                htmlFor="edit-content"
                                className="mb-1.5 block text-sm font-medium"
                            >
                                Transcript text
                            </label>

                            <textarea
                                id="edit-content"
                                value={editForm.content}
                                onChange={(event) =>
                                    setEditForm((current) => ({
                                        ...current,
                                        content: event.target.value,
                                    }))
                                }
                                required
                                rows={8}
                                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                disabled={updating}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={updating}
                                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {updating ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>

}