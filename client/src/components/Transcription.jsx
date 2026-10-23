
import { FileText, Pencil, Trash2 } from "lucide-react";

const TranscriptionCard = ({ item, onEdit, onDelete }) => {
  const formattedDate = new Date(item.createdAt).toLocaleString();

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <FileText size={20} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">
              {item.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">{formattedDate}</p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
          {item.language || "auto"}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
        {item.content}
      </p>

      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );
};

export default TranscriptionCard;
