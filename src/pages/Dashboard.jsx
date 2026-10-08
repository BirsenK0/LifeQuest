import { useState } from "react";
import { CATEGORIES } from "../interfaces/task.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskCard from "../components/TaskCard.jsx";
import ProgressPanel from "../components/ProgressPanel.jsx";
import useLocalStorage from "../hooks/useLocalStorage.js";

function Dashboard() {
  const [tasks, setTasks] = useLocalStorage(
    "lifequest-tasks",
    []
  );

  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tümü");
  const [categoryFilter, setCategoryFilter] = useState("Tümü");

  // CREATE + UPDATE
  function saveTask(taskData) {
    if (editingTask) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...taskData }
            : task
        )
      );

      setEditingTask(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((previousTasks) => [
        newTask,
        ...previousTasks,
      ]);
    }
  }

  // Görev tamamlama
  function toggleTask(id) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: task.completed
                ? null
                : new Date().toISOString(),
            }
          : task
      )
    );
  }

  // DELETE
  function deleteTask(id) {
    const confirmed = window.confirm(
      "Bu görevi silmek istediğine emin misin?"
    );

    if (!confirmed) return;

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );

    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  }

  // UPDATE için formu doldurma
  function startEditing(task) {
    setEditingTask(task);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // READ + Filtreleme
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLocaleLowerCase("tr-TR")
      .includes(search.toLocaleLowerCase("tr-TR"));

    const matchesStatus =
      filter === "Tümü" ||
      (filter === "Tamamlanan" && task.completed) ||
      (filter === "Bekleyen" && !task.completed);

    const matchesCategory =
      categoryFilter === "Tümü" ||
      task.category === categoryFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCategory
    );
  });

  return (
    <div className="dashboard">
      <header className="site-header">
        <div className="brand">
          <span className="brand-icon">✿</span>
          <span>LifeQuest</span>
        </div>

        <span className="header-label">
          My little growth space ♡
        </span>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <p className="eyebrow">WELCOME TO YOUR SPACE</p>

          <h1>
            Küçük adımlar,
            <br />
            <span>büyük hayaller. ✨</span>
          </h1>

          <p>
            Bugün kendin için güzel bir şey yap.
            Görevlerini tamamla, puan kazan ve gelişimini izle.
          </p>
        </section>

        <ProgressPanel tasks={tasks} />

        <TaskForm
          key={editingTask?.id ?? "new-task"}
          onSave={saveTask}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        <section className="panel task-list-section">
          <div className="section-heading">
            <h2>Görevlerim 🌼</h2>
            <p>Bugün hangi hayaline bir adım atacaksın?</p>
          </div>

          <div className="filters">
            <input
              type="search"
              placeholder="Görev ara..."
              aria-label="Görev ara"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              aria-label="Duruma göre filtrele"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
            >
              <option>Tümü</option>
              <option>Bekleyen</option>
              <option>Tamamlanan</option>
            </select>

            <select
              aria-label="Kategoriye göre filtrele"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              <option>Tümü</option>
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="task-list">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={startEditing}
                  onDelete={deleteTask}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🌷</div>
                <h3>
                  {tasks.length === 0
                    ? "Henüz bir görevin yok."
                    : "Bu filtreye uygun görev bulunamadı."}
                </h3>
                <p>
                  {tasks.length === 0
                    ? "Yeni bir görev ekleyerek yolculuğuna başla!"
                    : "Aramanı veya filtrelerini değiştirmeyi dene."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        Made with ♡ — LifeQuest
      </footer>
    </div>
  );
}

export default Dashboard;
