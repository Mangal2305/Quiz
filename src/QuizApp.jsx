import { useState } from "react";

const QUESTIONS = [
  { q: "What is the capital of Australia?", options: ["ahmedabad", "Melbourne", "junagadh", "Brisbane"], answer: 2, category: "Geography" },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1, category: "Science" },
  { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], answer: 1, category: "Math" },
  { q: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"], answer: 2, category: "Literature" },
  { q: "What is the chemical symbol for water?", options: ["O2", "H2O", "CO2", "NaCl"], answer: 1, category: "Science" },
  { q: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2, category: "History" },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3, category: "Geography" },
  { q: "Which language is primarily used to style web pages?", options: ["HTML", "JavaScript", "CSS", "Python"], answer: 2, category: "Technology" },
];

const LETTERS = ["A", "B", "C", "D"];

function ResultScreen({ correct, wrong, total, onRestart }) {
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 87 ? "🏆" : pct >= 62 ? "🎉" : pct >= 37 ? "👍" : "💪";
  const message =
    pct >= 87 ? "Outstanding! You're a trivia master." :
    pct >= 62 ? "Great job! You know your stuff." :
    pct >= 37 ? "Not bad! Keep practising." :
    "Better luck next time — keep learning!";

  return (
    <div style={styles.resultCard}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
      <div style={styles.resultScore}>{correct} / {total}</div>
      <div style={styles.resultSub}>{message}</div>
      <div style={styles.breakdown}>
        <div style={styles.rbCard}>
          <div style={{ ...styles.rbNum, color: "#27500A" }}>{correct}</div>
          <div style={styles.rbLabel}>Correct</div>
        </div>
        <div style={styles.rbCard}>
          <div style={{ ...styles.rbNum, color: "#791F1F" }}>{wrong}</div>
          <div style={styles.rbLabel}>Wrong</div>
        </div>
        <div style={styles.rbCard}>
          <div style={styles.rbNum}>{pct}%</div>
          <div style={styles.rbLabel}>Score</div>
        </div>
      </div>
      <button style={styles.primaryBtn} onClick={onRestart}>Play again</button>
    </div>
  );
}

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[current];
  const answered = selected !== null;
  const isLast = current === QUESTIONS.length - 1;
  const progress = (current / QUESTIONS.length) * 100;

  function handleSelect(i) {
    if (answered) return;
    setSelected(i);
    if (i === q.answer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + 10);
    } else {
      setWrong((w) => w + 1);
    }
  }

  function handleNext() {
    if (isLast) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setDone(false);
  }

  if (done) {
    return (
      <div style={styles.wrap}>
        <ResultScreen correct={correct} wrong={wrong} total={QUESTIONS.length} onRestart={handleRestart} />
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      {/* Progress Bar */}
      <div style={styles.progressBg}>
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
      </div>

      {/* Question Card */}
      <div style={styles.questionCard}>
        <div style={styles.qMeta}>{q.category} · Question {current + 1} of {QUESTIONS.length}</div>
        <div style={styles.qText}>{q.q}</div>
      </div>

      {/* Options */}
      <div style={styles.optionsGrid}>
        {q.options.map((opt, i) => {
          let bg = "#fff";
          let border = "0.5px solid #ccc";
          let color = "#111";
          let badgeBg = "#f0f0f0";
          let badgeColor = "#555";

          if (answered) {
            if (i === q.answer) {
              bg = "#EAF3DE"; border = "0.5px solid #3B6D11"; color = "#27500A";
              badgeBg = "#3B6D11"; badgeColor = "#EAF3DE";
            } else if (i === selected) {
              bg = "#FCEBEB"; border = "0.5px solid #A32D2D"; color = "#791F1F";
              badgeBg = "#A32D2D"; badgeColor = "#FCEBEB";
            } else {
              bg = "#f9f9f9"; color = "#999";
            }
          }

          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => handleSelect(i)}
              style={{ ...styles.optionBtn, background: bg, border, color }}
            >
              <span style={{ ...styles.letterBadge, background: badgeBg, color: badgeColor }}>
                {LETTERS[i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div style={selected === q.answer ? styles.feedbackCorrect : styles.feedbackWrong}>
          {selected === q.answer
            ? "✓ Correct! Well done."
            : `✗ The correct answer was "${q.options[q.answer]}".`}
        </div>
      )}

      {/* Bottom Row */}
      <div style={styles.actionRow}>
        <span style={styles.scoreChip}>Score: {score}</span>
        {answered && (
          <button style={styles.primaryBtn} onClick={handleNext}>
            {isLast ? "See results" : "Next question →"}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "2rem 1rem",
    fontFamily: "system-ui, sans-serif",
  },
  progressBg: {
    height: 6,
    background: "#eee",
    borderRadius: 99,
    marginBottom: "2rem",
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    background: "#534AB7",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  questionCard: {
    background: "#fff",
    border: "0.5px solid #ddd",
    borderRadius: 12,
    padding: "1.25rem",
    marginBottom: "1rem",
  },
  qMeta: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
    letterSpacing: "0.04em",
  },
  qText: {
    fontSize: 17,
    fontWeight: 500,
    lineHeight: 1.5,
    color: "#111",
  },
  optionsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: "1rem",
  },
  optionBtn: {
    border: "0.5px solid #ccc",
    borderRadius: 8,
    padding: "0.7rem 1rem",
    fontSize: 15,
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "background 0.15s",
  },
  letterBadge: {
    width: 26,
    height: 26,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
  },
  feedbackCorrect: {
    padding: "0.7rem 1rem",
    background: "#EAF3DE",
    border: "0.5px solid #639922",
    color: "#27500A",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: "1rem",
  },
  feedbackWrong: {
    padding: "0.7rem 1rem",
    background: "#FCEBEB",
    border: "0.5px solid #E24B4A",
    color: "#791F1F",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: "1rem",
  },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreChip: {
    fontSize: 13,
    color: "#666",
  },
  primaryBtn: {
    background: "#534AB7",
    color: "#EEEDFE",
    border: "none",
    borderRadius: 8,
    padding: "0.6rem 1.25rem",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  resultCard: {
    background: "#fff",
    border: "0.5px solid #ddd",
    borderRadius: 12,
    padding: "2rem",
    textAlign: "center",
  },
  resultScore: {
    fontSize: 36,
    fontWeight: 500,
    color: "#111",
    marginBottom: 4,
  },
  resultSub: {
    fontSize: 15,
    color: "#666",
    marginBottom: "1.5rem",
  },
  breakdown: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: "1.5rem",
  },
  rbCard: {
    background: "#f5f5f5",
    borderRadius: 8,
    padding: "0.75rem 1.25rem",
    minWidth: 80,
  },
  rbNum: {
    fontSize: 22,
    fontWeight: 500,
    color: "#111",
  },
  rbLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
};
