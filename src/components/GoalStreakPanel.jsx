import { useEffect, useState } from "react";

function getDayKey(date) {
  return date.toDateString();
}

function GoalStreakPanel({
  events,
  tasks,
  dailyGoal,
  onDailyGoalChange,
}) {
  const [today, setToday] = useState(() => new Date());
  const todayKey = getDayKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setToday(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const completedToday = tasks.filter(
    (task) =>
      task.completed &&
      task.completedAt &&
      getDayKey(new Date(task.completedAt)) === todayKey
  ).length;

  const activeDays = new Set(
    events.map((event) => getDayKey(new Date(event.completedAt)))
  );
  const streakStart = activeDays.has(todayKey)
    ? today
    : activeDays.has(getDayKey(yesterday))
      ? yesterday
      : null;

  let streak = 0;
  if (streakStart) {
    const date = new Date(streakStart);
    while (activeDays.has(getDayKey(date))) {
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
  }

  const goalProgress = Math.min(
    Math.round((completedToday / dailyGoal) * 100),
    100
  );
  const goalReached = completedToday >= dailyGoal;

  return (
    <section className="goal-streak-panel">
      <div className="goal-card">
        <div className="goal-card-heading">
          <div>
            <p className="eyebrow">BUGÜNÜN HEDEFİ</p>
            <h2>{goalReached ? "Harika iş! ✨" : "Her adım sayılır"}</h2>
          </div>
          <label className="goal-setting">
            <span>Hedef</span>
            <select
              aria-label="Günlük görev hedefi"
              value={dailyGoal}
              onChange={(event) =>
                onDailyGoalChange(Number(event.target.value))
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((goal) => (
                <option key={goal} value={goal}>
                  {goal} görev
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="goal-copy">
          {goalReached
            ? `Bugünkü ${dailyGoal} görevlik hedefini tamamladın.`
            : `Günlük hedefine ulaşmak için ${Math.max(
                dailyGoal - completedToday,
                0
              )} görev daha tamamla.`}
        </p>
        <div
          className="goal-progress-track"
          role="progressbar"
          aria-valuenow={Math.min(completedToday, dailyGoal)}
          aria-valuemin={0}
          aria-valuemax={dailyGoal}
          aria-label="Günlük hedef ilerlemesi"
        >
          <div
            className="goal-progress-fill"
            style={{ width: `${goalProgress}%` }}
          />
        </div>
        <p className="goal-count">
          {Math.min(completedToday, dailyGoal)} / {dailyGoal} görev
        </p>
      </div>

      <div className="streak-card">
        <div className="streak-icon" aria-hidden="true">
          🔥
        </div>
        <div>
          <p className="eyebrow">GÜNLÜK SERİ</p>
          <h2>
            {streak} gün
          </h2>
          <p className="streak-copy">
            {streak
              ? "Güzel gidiyorsun, devam et!"
              : "Serini başlatmak için bugün bir görev tamamla."}
          </p>
        </div>
      </div>
    </section>
  );
}

export default GoalStreakPanel;
