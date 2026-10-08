import { useEffect, useState } from "react";
import { XP_BY_PRIORITY } from "../interfaces/task.js";

function getDayKey(date) {
  return date.toDateString();
}

function getLongestStreak(events) {
  const activeDays = [
    ...new Set(
      events.map((event) => getDayKey(new Date(event.completedAt)))
    ),
  ]
    .map((day) => new Date(day))
    .sort((first, second) => first - second);

  let longestStreak = 0;
  let currentStreak = 0;
  let previousDay = null;

  for (const day of activeDays) {
    if (previousDay) {
      const daysBetween = Math.round(
        (day - previousDay) / (24 * 60 * 60 * 1000)
      );
      currentStreak = daysBetween === 1 ? currentStreak + 1 : 1;
    } else {
      currentStreak = 1;
    }

    longestStreak = Math.max(longestStreak, currentStreak);
    previousDay = day;
  }

  return longestStreak;
}

function AchievementPanel({ events, tasks, dailyGoal }) {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setToday(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const todayKey = getDayKey(today);
  const completedToday = tasks.filter(
    (task) =>
      task.completed &&
      task.completedAt &&
      getDayKey(new Date(task.completedAt)) === todayKey
  ).length;
  const totalXP = tasks.reduce(
    (sum, task) =>
      task.completed
        ? sum + (XP_BY_PRIORITY[task.priority] ?? 0)
        : sum,
    0
  );
  const longestStreak = getLongestStreak(events);

  const achievements = [
    {
      id: "first-task",
      icon: "🌱",
      title: "İlk Adım",
      description: "İlk görevini tamamladın.",
      unlocked: events.length >= 1,
    },
    {
      id: "daily-goal",
      icon: "🌸",
      title: "Bugünün Kahramanı",
      description: "Günlük görev hedefine ulaştın.",
      unlocked: completedToday >= dailyGoal,
    },
    {
      id: "weekly-streak",
      icon: "🔥",
      title: "İstikrar",
      description: "7 gün üst üste görev tamamladın.",
      unlocked: longestStreak >= 7,
    },
    {
      id: "level-up",
      icon: "⭐",
      title: "Seviye Atladı",
      description: "100 XP kazandın.",
      unlocked: totalXP >= 100,
    },
  ];

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <section className="panel achievement-panel">
      <div className="section-heading">
        <h2>Başarı rozetlerin 🏅</h2>
        <p>
          {unlockedCount} / {achievements.length} rozet açıldı. Küçük
          adımlarını kutla!
        </p>
      </div>

      <div className="achievement-list">
        {achievements.map((achievement) => (
          <article
            className={`achievement-card ${
              achievement.unlocked ? "unlocked" : "locked"
            }`}
            key={achievement.id}
            aria-label={`${achievement.title}: ${
              achievement.unlocked ? "kazanıldı" : "henüz kazanılmadı"
            }`}
          >
            <span className="achievement-icon" aria-hidden="true">
              {achievement.icon}
            </span>
            <div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </div>
            <span className="achievement-status">
              {achievement.unlocked ? "Kazanıldı" : "Kilitli"}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AchievementPanel;
