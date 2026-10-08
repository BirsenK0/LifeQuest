
import { XP_BY_PRIORITY } from "../interfaces/task.js";

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-card ${task.completed ? "completed" : ""}`}>
      <div className="task-top">
        <div className="task-info">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={`${task.title} görevini tamamla veya geri al`}
          />

          <div>
            <h3>{task.title}</h3>

            <div className="task-tags">
              <span className="tag">{task.category}</span>
              <span className="tag priority">{task.priority}</span>
            </div>
          </div>
        </div>

        <span className="xp-badge">
          +{XP_BY_PRIORITY[task.priority]} XP
        </span>
      </div>

      <div className="task-bottom">
        <span className="task-status">
          {task.completed ? "✓ Tamamlandı" : "◷ Devam ediyor"}
        </span>

        <div className="task-actions">
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(task)}
          >
            Düzenle
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(task.id)}
          >
            Sil
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;
