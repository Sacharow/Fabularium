import type { CharacterSectionProps, StatDetail } from "./types";

interface GeneralSectionProps extends CharacterSectionProps {
  content: StatDetail[];
}

export function GeneralSection({ content }: GeneralSectionProps) {
  const generalStats = content as StatDetail[];

  const getGeneralStat = (name: string) =>
    generalStats.find((stat) => stat.name === name)?.value ?? "-";

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-6 shadow-[0_0_0_1px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-2 pb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-light">
              Main Stats
            </p>
            <div className="flex flex-col gap-1">
              <h2 className="text-4xl font-bold text-neutral-text">
                {getGeneralStat("Name")} {getGeneralStat("Last Name")}
              </h2>
              <p className="text-sm text-gray-light">
                {getGeneralStat("Nickname")}
              </p>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Hit Points", value: getGeneralStat("Hit Points") },
              { label: "Armor Class", value: getGeneralStat("Armor Class") },
              { label: "Speed", value: getGeneralStat("Speed") },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-gold-dark bg-dark p-4 flex flex-col gap-2"
              >
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-neutral-text">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold-light">
                Character Build
              </p>
              <h3 className="text-lg font-semibold text-neutral-text">
                Class, Subclass, and Heritage
              </h3>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Class", value: getGeneralStat("Class") },
              { label: "Subclass", value: getGeneralStat("Subclass") },
              { label: "Race", value: getGeneralStat("Race") },
              { label: "Subrace", value: getGeneralStat("Subrace") },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-gold-dark bg-dark p-4 flex flex-col gap-2"
              >
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-neutral-text">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Progress",
            items: [
              { label: "Level", value: getGeneralStat("Level") },
              { label: "Experience", value: getGeneralStat("Experience") },
              {
                label: "Proficiency Bonus",
                value: getGeneralStat("Proficiency Bonus"),
              },
            ],
          },
          {
            title: "Identity Notes",
            items: [
              { label: "Name", value: getGeneralStat("Name") },
              {
                label: "Last Name",
                value: getGeneralStat("Last Name"),
              },
              { label: "Nickname", value: getGeneralStat("Nickname") },
            ],
          },
          {
            title: "Other",
            items: [
              { label: "Inspiration", value: getGeneralStat("Inspiration") },
            ],
          },
        ].map((group) => (
          <article
            key={group.title}
            className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-4 pb-3">
              <h3 className="text-lg font-semibold text-neutral-text">
                {group.title}
              </h3>
              <span className="text-xs uppercase tracking-widest text-gold-light">
                Overview
              </span>
            </div>
            <hr className="border-gold-dark" />

            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 border border-gold-dark bg-dark px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-neutral-text text-right">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
