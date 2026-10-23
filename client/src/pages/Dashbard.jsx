
import { useState ,useEffect} from "react";
import {
    AudioLines,
    FileText,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import LiveTranscription from "../components/LiveTranscription";

import {
    getTranscriptions,
} from "../services/api";

const Dashboard = () => {
    const [transcriptions, setTranscriptions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen  bg-slate-50 text-slate-900 md:flex">
            <Sidebar />
            <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}
                <section className="mb-8 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">
                                Total transcripts
                            </p>
                            <FileText className="text-indigo-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                            {transcriptions.length}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Saved in your database
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">Languages</p>
                            <AudioLines className="text-indigo-600" size={22} />
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                            {
                                new Set(
                                    transcriptions.map(
                                        (item) => item.language || "auto"
                                    )
                                ).size
                            }
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Language labels in your history
                        </p>
                    </div>
                </section>

                <LiveTranscription
                    onSaved={(saved) => {
                        setTranscriptions((current) => [
                            saved,
                            ...current.filter((item) => item.id !== saved.id),
                        ]);
                    }}
                />
      
            </main>
        </div>
    );
};

export default Dashboard;
