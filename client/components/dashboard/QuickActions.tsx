import {
  Plus,
  FolderPlus,
  UserPlus,
} from "lucide-react";

export default function QuickActions() {
  return (
     <div className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ">

      <h2 className="mb-5 text-lg font-semibold text-stone-900">
        Quick Actions
      </h2>

      <div className="space-y-3">

        <button
          className="flex w-full items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition hover:bg-blue-50 hover:border-blue-500"
        >
          <Plus
            size={20}
            className="text-blue-600"
          />

          <span>Create Task</span>

        </button>

        <button
          className="flex w-full items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition hover:bg-blue-50 hover:border-blue-500"
        >
          <FolderPlus
            size={20}
            className="text-blue-600"
          />

          <span>Create Project</span>

        </button>

        <button
          className="flex w-full items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 transition hover:bg-blue-50 hover:border-blue-500"
        >
          <UserPlus
            size={20}
            className="text-blue-600"
          />

          <span>Invite Member</span>

        </button>

      </div>

    </div>
  );
}