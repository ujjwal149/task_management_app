import ProfileCard from "@/components/settings/ProfileCard";
import PasswordCard from "@/components/settings/PasswordCard";
import ProjectSettings from "@/components/settings/ProjectSettings";


export default function SettingsPage() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-stone-900">
          Settings
        </h1>

        <p className="mt-2 text-stone-500">
          Manage your account and workspace.
        </p>
      </div>

      <ProfileCard />

      <PasswordCard />

      <ProjectSettings />
      
    </div>
  );
}