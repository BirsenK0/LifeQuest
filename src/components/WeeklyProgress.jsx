import { useState } from "react";

const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function getMonday(date) {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function WeeklyProgress({ events }) {
  const [currentWeek] = useState(() => getMonday(new Date()));
  const [selectedWeek, setSelectedWeek] = useState(
    () => currentWeek.getTime()
  );
  const earliestEvent = events.reduce((earliest, event) => {
    const eventDate = new Date(event.completedAt);
    if (Number.isNaN(eventDate.getTime())) return earliest;

    const eventWeek = getMonday(eventDate);
    return eventWeek < earliest ? eventWeek : earliest;
  }, currentWeek);

  const weekOptions = [];
  const weekCursor = new Date(currentWeek);
  const lastWeekToShow = getMonday(earliestEvent);
  weekCursor.setDate(weekCursor.getDate() - 11 * 7);
  if (lastWeekToShow < weekCursor) {
    weekCursor.setTime(lastWeekToShow.getTime());
  }

  for (
    let week = new Date(currentWeek);
    week >= weekCursor;
    week.setDate(week.getDate() - 7)
  ) {
    weekOptions.push(new Date(week));
  }

  const selectedMonday = new Date(selectedWeek);
  const selectedSunday = new Date(selectedMonday);
  selectedSunday.setDate(selectedSunday.getDate() + 6);

  const dailyTotals = dayNames.map((dayName, index) => {
    const day = new Date(selectedMonday);
    day.setDate(day.getDate() + index);
    const dayKey = day.toDateString();
    const dayEvents = events.filter(
      (event) =>
        new Date(event.completedAt).toDateString() === dayKey
    );

    return {
      dayName,
      date: day,
      count: dayEvents.length,
      xp: dayEvents.reduce((sum, event) => sum + (event.xp || 0), 0),
    };
  });

  const totalCompleted = dailyTotals.reduce(
    (sum, day) => sum + day.count,
    0
  );
  const totalXP = dailyTotals.reduce((sum, day) => sum + day.xp, 0);
  const maxDailyCount = Math.max(
    1,
    ...dailyTotals.map((day) => day.count)
  );
  const isCurrentWeek = selectedMonday.getTime() === currentWeek.getTime();

  function changeWeek(direction) {
    const nextWeek = new Date(selectedMonday);
    nextWeek.setDate(nextWeek.getDate() + direction * 7);
    setSelectedWeek(nextWeek.getTime());
  }

  return (
    <section className="panel weekly-progress">
      <div className="section-heading weekly-heading">
        <div>
          <h2>Haftalık ilerlemen 🌷</h2>
          <p>Her hafta attığın küçük adımları burada görebilirsin.</p>
        </div>
        <div className="week-controls">
          <button
            type="button"
            className="week-arrow"
            aria-label="Önceki hafta"
            onClick={() => changeWeek(-1)}
            disabled={
              selectedWeek ===
              weekOptions[weekOptions.length - 1]?.getTime()
            }
          >
            ‹
          </button>
          <select
            aria-label="İncelenecek haftayı seç"
            value={selectedWeek}
            onChange={(event) =>
              setSelectedWeek(Number(event.target.value))
            }
          >
            {weekOptions.map((week) => {
              const weekEnd = new Date(week);
              weekEnd.setDate(weekEnd.getDate() + 6);
              const isThisWeek = week.getTime() === currentWeek.getTime();

              return (
                <option key={week.getTime()} value={week.getTime()}>
                  {isThisWeek
                    ? "Bu hafta"
                    : `${formatDate(week)} - ${formatDate(weekEnd)}`}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            className="week-arrow"
            aria-label="Sonraki hafta"
            onClick={() => changeWeek(1)}
            disabled={isCurrentWeek}
          >
            ›
          </button>
        </div>
      </div>

      <p className="week-date-range">
        {formatDate(selectedMonday)} – {formatDate(selectedSunday)}
      </p>

      <div className="week-summary">
        <div>
          <strong>{totalCompleted}</strong>
          <span>tamamlanan görev</span>
        </div>
        <div>
          <strong>{totalXP}</strong>
          <span>kazanılan XP</span>
        </div>
      </div>

      <div
        className="weekly-chart"
        role="img"
        aria-label={`${formatDate(selectedMonday)} haftasında günlere göre tamamlanan görev sayısı`}
      >
        {dailyTotals.map((day) => (
          <div
            className="chart-day"
            key={day.dayName}
            title={`${day.dayName}, ${formatDate(day.date)}: ${day.count} görev, ${day.xp} XP`}
          >
            <span className="chart-count">{day.count || ""}</span>
            <div className="chart-column">
              <div
                className="chart-bar"
                style={{
                  height: `${Math.max(
                    day.count ? 12 : 0,
                    (day.count / maxDailyCount) * 100
                  )}%`,
                }}
              />
            </div>
            <span className="chart-day-name">{day.dayName}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeeklyProgress;
