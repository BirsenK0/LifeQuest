
import { useState } from "react";
import { CATEGORIES, PRIORITIES } from "../interfaces/task.js";

function TaskForm({ onSave, editingTask, onCancel }) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [category, setCategory] = useState(
    editingTask?.category ?? "Eğitim"
  );
  const [priority, setPriority] = useState(
    editingTask?.priority ?? "Orta"
  );

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Lütfen bir görev adı yaz.");
      return;
    }

    onSave({
      title: title.trim(),
      category,
      priority,
    });

    setTitle("");
    setCategory("Eğitim");
    setPriority("Orta");
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>
          {editingTask ? "Görevini düzenle ✏️" : "Yeni bir görev ekle 🌷"}
        </h2>
        <p>Küçük adımlar, büyük başarılar!</p>
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-field">
          <label htmlFor="task-title">Görev adı</label>
          <input
            id="task-title"
            type="text"
            placeholder="Örn: 30 dakika React çalış"
            value={title}
            required
            maxLength={100}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-category">Kategori</label>
            <select
              id="task-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="task-priority">Öncelik</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-button">
            {editingTask ? "Değişiklikleri kaydet" : "+ Görev ekle"}
          </button>

          {editingTask && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
