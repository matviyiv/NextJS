"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import Header from "@/components/layout/Header";
import AppShell from "@/components/layout/AppShell";
import StatsPanel from "./StatsPanel";
import ListView from "./ListView";
import BoardView from "./BoardView";
import GroupView from "./GroupView";
import TagView from "./TagView";
import TaskForm from "@/components/tasks/TaskForm";
import TaskDetail from "@/components/tasks/TaskDetail";

export default function Dashboard() {
  const viewMode = useAppSelector((s) => s.ui.viewMode);
  const editingTaskId = useAppSelector((s) => s.ui.editingTaskId);
  const [showNewTask, setShowNewTask] = useState(false);

  const viewLabels = { list: "List View", board: "Board View", group: "Group View", tag: "Tag View" };

  return (
    <AppShell>
      <Header onAddTask={() => setShowNewTask(true)} />
      <div className="flex-1 overflow-auto p-6">
        <StatsPanel />

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-primary">{viewLabels[viewMode]}</h2>
        </div>

        {viewMode === "list" && <ListView />}
        {viewMode === "board" && <BoardView />}
        {viewMode === "group" && <GroupView />}
        {viewMode === "tag" && <TagView />}
      </div>

      <TaskForm open={showNewTask} onClose={() => setShowNewTask(false)} />
      {editingTaskId && <TaskDetail />}
    </AppShell>
  );
}
