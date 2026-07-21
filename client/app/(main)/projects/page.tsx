"use client";

import ProjectGrid from "@/components/project/ProjectGrid";
import ProjectSidebar from "@/components/project/ProjectSidebar";

export default function ProjectsPage() {
  return (
    <div className="space-y-8">

      {/* Page Header */}

      <div>

        <h1 className="text-4xl font-bold tracking-tight text-stone-900">
          Projects
        </h1>

        <p className="mt-2 text-stone-500">
          Organize your work into projects and manage them efficiently.
        </p>

      </div>

      {/* Main Layout */}

      <div
        className="
          grid
          gap-8
          xl:grid-cols-12
        "
      >

        {/* Project Cards */}

        <section
          className="
            xl:col-span-9
            order-2
            xl:order-1
          "
        >

          <ProjectGrid />

        </section>

        {/* Sidebar */}

        <aside
          className="
            xl:col-span-3
            order-1
            xl:order-2
          "
        >

          <ProjectSidebar />

        </aside>

      </div>

    </div>
  );
}