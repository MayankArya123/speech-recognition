
import { AudioLines, LayoutDashboard, History } from "lucide-react";
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
  const navigate = useNavigate()
  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-indigo-600 p-2 text-white">
          <AudioLines size={24} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">VoxScript</h1>
          <p className="text-xs text-slate-500">Speech to Text</p>
        </div>
      </div>

      <nav className="flex gap-2 md:flex-col">
        <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700">
          <LayoutDashboard size={19} />
          Dashboard
        </div>

        <div onClick={() => navigate('/history')} className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-500 cursor-pointer">
          <History size={19} />
          Transcription History
        </div>

      </nav>

      <div className="mt-auto hidden rounded-xl bg-slate-50 p-4 md:block">
        <p className="text-sm font-semibold text-slate-800">
          Multilingual transcription
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Capture speech and manage your saved transcripts in one place.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
