import { FormEvent, useState } from "react";
import { Task, Priority, Category } from "../types";
import {
  Check,
  Plus,
  Trash2,
  Flame,
  Zap,
  Leaf,
  Filter,
  CheckCheck,
  Target,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { soundEngine } from "../utils/audio";

interface Props {
  tasks: Task[];
  activeId: string | null;
  onAdd: (task: Omit<Task, "id" | "sessions" | "createdAt">) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  onClearCompleted: () => void;
}

export default function TaskList({
  tasks,
  activeId,
  onAdd,
  onToggle,
  onRemove,
  onSelect,
  onClearCompleted,
}: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("Work");
  const [estPomodoros, setEstPomodoros] = useState<number>(2);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "done">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories: Category[] = ["Work", "Study", "Code", "Personal", "Health"];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    soundEngine.playClick();
    onAdd({
      title: t,
      done: false,
      estimatedPomodoros: estPomodoros,
      priority,
      category,
    });
    setText("");
  };

  const handleToggleTask = (task: Task) => {
    soundEngine.playClick();
    if (!task.done) {
      // Celebratory burst
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#10b981", "#3b82f6"],
      });
      soundEngine.playChime("crystal", 0.4);
    }
    onToggle(task.id);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterTab === "active" && t.done) return false;
    if (filterTab === "done" && !t.done) return false;
    if (selectedCategory !== "All" && t.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;
  const activeCount = tasks.length - completedCount;

  const priorityMeta: Record<Priority, { label: string; icon: typeof Flame; color: string }> = {
    high: { label: "High", icon: Flame, color: "#ef4444" },
    medium: { label: "Med", icon: Zap, color: "#f59e0b" },
    low: { label: "Low", icon: Leaf, color: "#10b981" },
  };

  return (
    <section className="tasks-card" aria-label="Tasks Management">
      <div className="tasks-header">
        <div className="tasks-title-wrap">
          <Target size={20} className="tasks-title-icon" />
          <h3>Focus Mission Board</h3>
          <span className="task-counter-pill">
            {activeCount} active · {completedCount} done
          </span>
        </div>

        {completedCount > 0 && (
          <button
            className="clear-done-btn"
            onClick={onClearCompleted}
            title="Clear all completed tasks"
          >
            <CheckCheck size={14} /> Clear Done
          </button>
        )}
      </div>

      {/* Add Task Form */}
      <form onSubmit={submit} className="task-input-box">
        <div className="input-main-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What will you conquer next?"
            aria-label="New task"
            className="task-text-input"
          />
          <button className="add-task-btn" type="submit" disabled={!text.trim()}>
            <Plus size={18} /> Add
          </button>
        </div>

        <div className="task-meta-selectors">
          {/* Priority options */}
          <div className="selector-group">
            <span className="selector-label">Priority:</span>
            {(["high", "medium", "low"] as Priority[]).map((p) => {
              const meta = priorityMeta[p];
              const Icon = meta.icon;
              return (
                <button
                  type="button"
                  key={p}
                  className={`chip-btn ${priority === p ? `priority-${p} active` : ""}`}
                  onClick={() => setPriority(p)}
                >
                  <Icon size={12} />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category selector */}
          <div className="selector-group">
            <span className="selector-label">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="category-dropdown"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Est Pomodoros */}
          <div className="selector-group">
            <span className="selector-label">Est:</span>
            <select
              value={estPomodoros}
              onChange={(e) => setEstPomodoros(parseInt(e.target.value) || 1)}
              className="pomodoro-est-dropdown"
              title="Estimated Pomodoros"
            >
              {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                <option key={n} value={n}>
                  {n} 🍅
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* Filter Row */}
      <div className="task-filters-bar">
        <div className="filter-tabs">
          {(["all", "active", "done"] as const).map((tab) => (
            <button
              key={tab}
              className={`filter-tab-btn ${filterTab === tab ? "active" : ""}`}
              onClick={() => setFilterTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Category filter pills */}
        <div className="category-filter-pills">
          <Filter size={13} className="filter-icon" />
          <button
            className={`cat-pill ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="task-items-container">
        {filteredTasks.length === 0 ? (
          <div className="task-empty-state">
            <Sparkles size={28} className="empty-sparkle" />
            <p className="empty-title">All clear in this section!</p>
            <p className="empty-sub">
              {tasks.length === 0
                ? "Add your goals above and designate a task to begin your focus conquest."
                : "No matching tasks found for the selected filter."}
            </p>
          </div>
        ) : (
          <ul className="task-items-list">
            {filteredTasks.map((t) => {
              const meta = priorityMeta[t.priority || "medium"];
              const PriorityIcon = meta.icon;
              const isActive = t.id === activeId;

              return (
                <li
                  key={t.id}
                  className={`task-row ${t.done ? "done" : ""} ${isActive ? "active" : ""}`}
                >
                  <button
                    className={`custom-checkbox ${t.done ? "checked" : ""}`}
                    onClick={() => handleToggleTask(t)}
                    aria-label={`Mark "${t.title}" ${t.done ? "incomplete" : "complete"}`}
                  >
                    {t.done && <Check size={14} />}
                  </button>

                  <div
                    className="task-content-area"
                    onClick={() => !t.done && onSelect(t.id)}
                    role="button"
                    tabIndex={0}
                    title={t.done ? undefined : "Click to select for active focus"}
                  >
                    <span className="task-title-text">{t.title}</span>
                    <div className="task-badges-row">
                      <span className={`task-badge priority-badge ${t.priority || "medium"}`}>
                        <PriorityIcon size={11} />
                        {meta.label}
                      </span>
                      <span className="task-badge category-badge">{t.category || "General"}</span>
                      <span className="task-badge pomodoro-progress" title="Sessions completed / Estimated">
                        🍅 {t.sessions || 0} / {t.estimatedPomodoros || 1}
                      </span>
                      {isActive && <span className="active-glow-pill">Active Target</span>}
                    </div>
                  </div>

                  <button
                    className="task-delete-btn"
                    onClick={() => onRemove(t.id)}
                    aria-label={`Delete task "${t.title}"`}
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
