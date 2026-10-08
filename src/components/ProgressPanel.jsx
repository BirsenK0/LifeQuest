
import { useEffect, useState } from "react";
import { XP_BY_PRIORITY } from "../interfaces/task.js";

function ProgressPanel({ tasks }) {
  const [today] = useState(() => new Date().toDateString());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const currentDay = new Date().toDateString();
      setToday((previousDay) =>
        previousDay === currentDay ? previousDay : currentDay
      );
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.completed
  );
  const completedToday = tasks.filter(
    (task) =>
      task.completed &&
      task.completedAt &&
      new Date(task.completedAt).toDateString() === today
  ).length;

  const totalXP = completedTasks.reduce(
    (total, task) => total + XP_BY_PRIORITY[task.priority],
    0
  );
  const level = Math.floor(totalXP / 100) + 1;
  const currentXP = totalXP % 100;
  const progress = (currentXP / 100) * 100;
  const completionRate = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;
  return (
    <section className="progress-panel">
      <div className="level-heading">
        <div>
          <p className="eyebrow">YOUR JOURNEY ✨</p>
          <h2>Seviye {level}</h2>
          <p>Her küçük adım seni ileri taşır.</p>
        </div>

        <div className="level-icon">❤︎</div>
      </div>
      <div className="progress-label">
        <span>Seviye ilerlemesi</span>
        <strong>{currentXP} / 100 XP</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={currentXP}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Seviye ilerlemesi"
      >
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span>Toplam görev</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card">
          <span>Tamamlanan</span>
          <strong>{completedTasks.length}</strong>
        </div>

        <div className="stat-card">
          <span>Toplam XP</span>
          <strong>{totalXP}</strong>
        </div>

        <div className="stat-card">
          <span>Başarı oranı</span>
          <strong>%{completionRate}</strong>
        </div>
        <div className="stat-card">
          <span>Bugün tamamlanan</span>
          <strong>{completedToday}</strong>
        </div>
      </div>
    </section>
  );
}

export default ProgressPanel;
