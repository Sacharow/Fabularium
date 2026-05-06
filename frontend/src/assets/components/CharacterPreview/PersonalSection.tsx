import { ChevronDown } from "lucide-react";
import type {
  CharacterSectionProps,
  PersonalSectionContent,
  PersonalDetail,
  PersonalNote,
} from "./types";

interface PersonalSectionProps extends CharacterSectionProps {
  content: PersonalSectionContent;
}

export function PersonalSection({
  content,
  expandedItems,
  toggleItem,
}: PersonalSectionProps) {
  const personalContent = content as PersonalSectionContent;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-6 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-2 pb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-light">
              Character Essence
            </p>
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-neutral-text">
                Personality & Traits
              </h2>
              <p className="text-sm text-gray-light">
                Core characteristics and ideals
              </p>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Personality", key: "Personality" },
              { label: "Ideals", key: "Ideals" },
              { label: "Bonds", key: "Bonds" },
              { label: "Flaws", key: "Flaws" },
            ].map((item) => {
              const value =
                personalContent.details.find(
                  (d: PersonalDetail) => d.label === item.key,
                )?.value || "-";
              return (
                <div
                  key={item.label}
                  className="border border-gold-dark bg-dark p-4 flex flex-col gap-2"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    {item.label}
                  </p>
                  <p className="text-sm text-neutral-text leading-relaxed">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold-light">
                Physical Appearance
              </p>
              <h3 className="text-lg font-semibold text-neutral-text">
                Visual Profile
              </h3>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Height", key: "Height" },
              { label: "Weight", key: "Weight" },
              { label: "Eye Color", key: "Eye Color" },
              { label: "Hair Color", key: "Hair Color" },
              { label: "Skin Color", key: "Skin Color" },
              { label: "Age", key: "Age" },
            ].map((item) => {
              const value =
                personalContent.details.find(
                  (d: PersonalDetail) => d.label === item.key,
                )?.value || "-";
              return (
                <div
                  key={item.label}
                  className="border border-gold-dark bg-dark p-3 flex items-center justify-between gap-3"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold text-neutral-text">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 pb-3">
            <h3 className="text-lg font-semibold text-neutral-text">
              Alignment & Values
            </h3>
            <span className="text-xs uppercase tracking-widest text-gold-light">
              Profile
            </span>
          </div>
          <hr className="border-gold-dark" />

          <div className="flex flex-col gap-3">
            {personalContent.details.map((detail: PersonalDetail) => {
              if (["Alignment"].includes(detail.label)) {
                return (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4 border border-gold-dark bg-dark px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-widest text-gray-light">
                      {detail.label}
                    </p>
                    <p className="text-base font-semibold text-neutral-text text-right">
                      {detail.value}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>

        <article className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 pb-3">
            <h3 className="text-lg font-semibold text-neutral-text">
              Languages
            </h3>
            <span className="text-xs uppercase tracking-widest text-gold-light">
              Communication
            </span>
          </div>
          <hr className="border-gold-dark" />

          <div className="flex flex-col gap-3">
            {personalContent.details.map((detail: PersonalDetail) => {
              if (["Languages"].includes(detail.label)) {
                return (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4 border border-gold-dark bg-dark px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-widest text-gray-light">
                      {detail.label}
                    </p>
                    <p className="text-base font-semibold text-neutral-text text-right">
                      {detail.value}
                    </p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => toggleItem("personal-backstory")}
            className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral transition-colors ${
              expandedItems.has("personal-backstory")
                ? "bg-light hover:bg-light/50"
                : "bg-neutral hover:bg-light/50"
            }`}
            aria-expanded={expandedItems.has("personal-backstory")}
            aria-controls="personal-backstory-panel"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-text">
                  Backstory
                </h3>
              </div>
              <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text flex-shrink-0">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedItems.has("personal-backstory")
                      ? "rotate-180 text-gold-neutral"
                      : "text-gray-neutral"
                  }`}
                />
                {expandedItems.has("personal-backstory") ? "Close" : "Open"}
              </span>
            </div>
          </button>

          {expandedItems.has("personal-backstory") && (
            <div
              id="personal-backstory-panel"
              className="bg-neutral p-4 border-2 border-gold-dark text-sm text-neutral-text leading-7"
            >
              {personalContent.backstory}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => toggleItem("personal-notes")}
            className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral transition-colors ${
              expandedItems.has("personal-notes")
                ? "bg-light hover:bg-light/50"
                : "bg-neutral hover:bg-light/50"
            }`}
            aria-expanded={expandedItems.has("personal-notes")}
            aria-controls="personal-notes-panel"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-text">
                  Notes
                </h3>
              </div>
              <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text flex-shrink-0">
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedItems.has("personal-notes")
                      ? "rotate-180 text-gold-neutral"
                      : "text-gray-neutral"
                  }`}
                />
                {expandedItems.has("personal-notes") ? "Close" : "Open"}
              </span>
            </div>
          </button>

          {expandedItems.has("personal-notes") && (
            <div
              id="personal-notes-panel"
              className="bg-neutral border-2 border-gold-dark p-4 flex flex-col gap-3"
            >
              {personalContent.notes.map(
                (note: PersonalNote, index: number) => {
                  const noteId = `personal-note-${index}`;
                  const isNoteOpen = expandedItems.has(noteId);

                  return (
                    <div key={noteId} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => toggleItem(noteId)}
                        className={`w-full p-3 text-left cursor-pointer border border-gold-dark transition-colors ${
                          isNoteOpen
                            ? "bg-light hover:bg-light/50"
                            : "bg-neutral hover:bg-light/50"
                        }`}
                        aria-expanded={isNoteOpen}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-neutral-text">
                              {note.title}
                            </p>
                          </div>
                          <ChevronDown
                            className={`h-3 w-3 transition-transform flex-shrink-0 ${
                              isNoteOpen
                                ? "rotate-180 text-gold-neutral"
                                : "text-gray-neutral"
                            }`}
                          />
                        </div>
                      </button>

                      {isNoteOpen && (
                        <div className="bg-neutral p-3 border border-gold-dark text-sm text-neutral-text leading-7">
                          {note.content}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
