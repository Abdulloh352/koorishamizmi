import React, { useState } from "react";

const noButtonLabels = [
  "Yo‘q",
  "Iltimos qilsamchi?",
  "Kuchliroq iltimos qilaman Ha albaata ni bos🥺",
];

const locations = ["Parkent", "Yangibozor"];
const times = ["9:00", "10:00", "11:00"];
const noButtonPositions = [
  { left: "24%", top: "22%" },
  { left: "76%", top: "78%" },
  { left: "24%", top: "78%" },
];

function getLocalDateString(date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function getTomorrow() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getLocalDateString(tomorrow);
}

function formatDate(date) {
  const [year, month, day] = date.split("-").map(Number);
  const months = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ];
  return `${day}-${months[month - 1]} ${year}-yil`;
}

function App() {
  const [page, setPage] = useState("invite");
  const [noAttempts, setNoAttempts] = useState(0);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(getTomorrow);
  const [time, setTime] = useState("");
  const [timePrompt, setTimePrompt] = useState("");

  const noButtonDisabled = noAttempts >= 3;
  const noButtonPosition = noButtonPositions[Math.min(noAttempts, 2)];
  const today = getLocalDateString(new Date());

  function handleNoClick() {
    if (!noButtonDisabled) {
      setNoAttempts((attempts) => attempts + 1);
    }
  }

  function handleTimeChoice(selectedTime) {
    if (selectedTime !== "9:00") {
      setTimePrompt("Nimaga bunchalik kechni tanladingiz? 😊 9:00 ni tanlasangiz, juda xursand bo‘laman!");
      return;
    }

    setTime(selectedTime);
    setTimePrompt("");
    setPage("result");
  }

  return (
    <main className="page-shell">
      <div className="floating-heart heart-one" aria-hidden="true">♡</div>
      <div className="floating-heart heart-two" aria-hidden="true">✦</div>
      <div className="floating-heart heart-three" aria-hidden="true">♡</div>

      <section className="card" aria-live="polite">
        {page === "invite" && (
          <div className="invite-screen">
            <div className="envelope" aria-hidden="true">💌</div>
            <p className="eyebrow">Senga kichkina savolim bor</p>
            <h1>Men bilan uchrashuvga borasanmi?</h1>
            <p className="description">
              Birga vaqt o‘tkazsak, juda xursand bo‘lardim ✨
            </p>
            <div className="button-arena">
              <button
                className="button button-yes"
                onClick={() => setPage("details")}
              >
                Ha, albatta! <span aria-hidden="true">💖</span>
              </button>
              <button
                className={`button button-no${noButtonDisabled ? " button-no-faded" : ""}`}
                style={{
                  left: noButtonPosition.left,
                  top: noButtonPosition.top,
                }}
                onClick={handleNoClick}
                disabled={noButtonDisabled}
                aria-label={noButtonDisabled ? "Yo‘q tugmasi o‘chirildi" : noButtonLabels[Math.min(noAttempts, 2)]}
              >
                {noButtonLabels[Math.min(noAttempts, 2)]}
              </button>
            </div>
            {noButtonDisabled && (
              <p className="hint">Endi faqat “Ha”ni tanlash qoldi 😊</p>
            )}
          </div>
        )}

        {page === "details" && (
          <div className="details-screen">
            <button className="back-button" onClick={() => setPage("invite")}>
              ← Ortga
            </button>
            <div className="step-icon" aria-hidden="true">📍</div>
            <p className="eyebrow">1-qadam</p>
            <h1>Qayerda uchrashamiz?</h1>
            <p className="description">O‘zingga yoqqan manzilni tanla</p>
            <div className="choice-grid location-grid">
              {locations.map((place) => (
                <button
                  className={`choice-card${location === place ? " choice-selected" : ""}`}
                  key={place}
                  onClick={() => setLocation(place)}
                  aria-pressed={location === place}
                >
                  <span className="choice-emoji" aria-hidden="true">
                    {place === "Parkent" ? "🌳" : "🌷"}
                  </span>
                  <span>{place}</span>
                </button>
              ))}
            </div>
            <label className="date-label" htmlFor="meeting-date">
              Qaysi kuni?
            </label>
            <input
              id="meeting-date"
              className="date-input"
              type="date"
              min={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <button
              className="button button-primary continue-button"
              onClick={() => setPage("time")}
              disabled={!location || !date}
            >
              Davom etish <span aria-hidden="true">→</span>
            </button>
          </div>
        )}

        {page === "time" && (
          <div className="time-screen">
            <button className="back-button" onClick={() => setPage("details")}>
              ← Ortga
            </button>
            <div className="step-icon" aria-hidden="true">⏰</div>
            <p className="eyebrow">2-qadam</p>
            <h1>Qachon uchrashamiz?</h1>
            <p className="description">
              {location}da, {formatDate(date)} kuni qaysi vaqt qulay?
            </p>
            <div className="choice-grid time-grid">
              {times.map((choice) => (
                <button
                  className={`choice-card time-card${choice === "9:00" ? " recommended-time" : ""}`}
                  key={choice}
                  onClick={() => handleTimeChoice(choice)}
                >
                  <span className="choice-emoji" aria-hidden="true">🕘</span>
                  <span>{choice}</span>
                  {choice === "9:00" && <span className="recommended-label">Eng yaxshi vaqt 💖</span>}
                </button>
              ))}
            </div>
            {timePrompt && (
              <div className="time-prompt" role="status">
                <p>{timePrompt}</p>
                <button
                  className="button button-primary prompt-button"
                  onClick={() => handleTimeChoice("9:00")}
                >
                  Ha, 9:00 ni tanlayman 💕
                </button>
              </div>
            )}
          </div>
        )}

        {page === "result" && (
          <div className="result-screen">
            <div className="result-confetti" aria-hidden="true">🌸 ✨ 💖</div>
            <p className="eyebrow">Kelishdik!</p>
            <h1>{time === "9:00" ? "Ajoyib tanlov! 💕" : "Nimaga bunchalik kechni tanladingiz? 😊"}</h1>
            <p className="description">
              {time === "9:00"
                ? "Seni tanlagan manzilingda uchrataman!"
                : "Mayli, seni kutaman — faqat kech qolma!"}
            </p>
            <div className="meeting-summary">
              <p><span aria-hidden="true">📍</span> {location}</p>
              <p><span aria-hidden="true">📅</span> {formatDate(date)}</p>
              <p><span aria-hidden="true">🕘</span> Soat {time} da uchrashamiz</p>
            </div>
            <div className="result-hearts" aria-hidden="true">♡　♡　♡</div>
            <button className="text-button" onClick={() => setPage("details")}>
              Tanlovlarni o‘zgartirish
            </button>
          </div>
        )}
      </section>
      <p className="footer-note">Eng chiroyli uchrashuvlar kichkina taklifdan boshlanadi ♡</p>
    </main>
  );
}

export default App;
