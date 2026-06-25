import { createElement, useEffect, useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { CATEGORIES } from "../constants/categories.js";

export function InterestModal({ open, interests, onClose, onSave }) {
  const [draft, setDraft] = useState(interests);

  useEffect(() => {
    if (open) {
      setDraft(interests);
    }
  }, [interests, open]);

  if (!open) {
    return null;
  }

  const toggle = (category) => {
    setDraft((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="interest-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="interest-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="modal-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <span className="modal-icon">
          <Sparkles size={22} />
        </span>
        <p className="section-kicker">Your briefing</p>
        <h2 id="interest-title">What are you curious about?</h2>
        <p className="modal-copy">
          Pick a few interests and Quick Headlines will shape a personal news feed
          around them. Your choices stay in this browser.
        </p>
        <div className="interest-grid">
          {CATEGORIES.map(({ id, label, icon }) => {
            const selected = draft.includes(id);
            return (
              <button
                className={`interest-option ${selected ? "selected" : ""}`}
                type="button"
                key={id}
                onClick={() => toggle(id)}
              >
                {createElement(icon, { size: 20 })}
                <span>{label}</span>
                {selected && <Check className="interest-check" size={17} />}
              </button>
            );
          })}
        </div>
        <button
          className="primary-button modal-save"
          type="button"
          disabled={draft.length === 0}
          onClick={() => onSave(draft)}
        >
          Save my interests
        </button>
      </section>
    </div>
  );
}
