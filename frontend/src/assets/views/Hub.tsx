import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import D20 from "../components/ui/D20";
import { Circle, Diamond, Star } from "lucide-react";

function Hub() {
  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-12 py-10">
        <section className="border-2 border-gold-neutral bg-neutral p-14">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex items-center gap-6 text-gold-neutral">
              <D20 className="h-14 w-14" />
              <h1 className="text-5xl font-bold tracking-widest text-gold-neutral sm:text-6xl">
                FABULARIUM
              </h1>
              <D20 className="h-14 w-14" />
            </div>

            <p className="max-w-3xl text-lg leading-8">
              A campaign manager for tabletop role-playing games, designed to
              keep your worldbuilding and session notes organized in one calm,
              readable space.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <NavLink
                to="/sign-in"
                className="border-2 border-gold-neutral bg-dark px-12 py-3 text-sm font-semibold uppercase hover:bg-gold-neutral"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/sign-up"
                className="border-2 border-gold-neutral bg-dark px-12 py-3 text-sm font-semibold uppercase hover:bg-gold-neutral"
              >
                Sign Up
              </NavLink>
            </div>
          </div>
        </section>

        <section className="grid gap-6 grid-cols-3">
          <InfoCard
            title="About"
            icon="Star"
            body="A lightweight, intuitive, and visually calm campaign manager for tabletop role-playing games."
          />
          <InfoCard
            title="How it works"
            icon="Circle"
            body="Create camapigns or join them as a player, organize your worldbuilding notes and session recaps in one place, and share them with your players to keep everyone on the same page."
          />
          <InfoCard
            title="Mission"
            icon="Diamond"
            body="Make campaign prep and session management feel lighter, cleaner, and easier to revisit later."
          />
        </section>

        <section className="border-2 border-gold-neutral bg-neutral px-12 py-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold uppercase text-gold-neutral tracking-widest">
                Features
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-text-neutral">
                Everything you need to keep your campaign organized and your
                players informed, without the need to juggle multiple apps or
                tabs during prep and sessions.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureChip title="Character creation" />
            <FeatureChip title="Campaign management" />
            <FeatureChip title="Material browser" />
          </div>
        </section>

        <section className="border-2 border-gold-neutral bg-neutral px-12 py-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold uppercase text-gold-neutral tracking-widest">
              Built by
            </h2>
            <p className="text-sm text-text-neutral">Project contributors</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {Object.values(authors).map(({ name: author, image, github }) => (
              <NavLink
                key={author}
                to={github}
                className="flex items-center gap-4 border-2 border-gold-neutral bg-dark px-4 py-4 hover:bg-light"
              >
                <img
                  src={image}
                  alt={author}
                  className="h-14 w-14 rounded-full border-2 border-gold-neutral object-cover"
                />
                <div>
                  <p className="font-medium">{author}</p>
                  <p className="text-sm text-text-neutral">GitHub profile</p>
                </div>
              </NavLink>
            ))}
          </div>

          <p className="mt-8 text-sm text-text-neutral">
            Repository:{" "}
            <a
              href="https://github.com/Sacharow/Fabularium"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-neutral hover:text-gold-light"
            >
              github.com/Sacharow/Fabularium
            </a>
          </p>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  body,
}: {
  title: string;
  icon: string;
  body: string;
}) {
  return (
    <article className="border-2 border-gold-neutral bg-neutral p-6">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold-neutral">
        {icon === "Star" && <Star />}
        {icon === "Circle" && <Circle />}
        {icon === "Diamond" && <Diamond />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-neutral">{body}</p>
    </article>
  );
}

function FeatureChip({ title }: { title: string }) {
  return (
    <div className="border-2 border-gold-neutral bg-dark px-5 py-4 text-sm font-medium">
      {title}
    </div>
  );
}

const authors = {
  "1": {
    name: "Szymon Lato",
    image: "/authors/SLATO.jpg",
    github: "https://github.com/LatoSzymon",
  },
  "2": {
    name: "Szymon Ligenza",
    image: "/authors/SLIGA.jpg",
    github: "https://github.com/Logenz0202",
  },
  "3": {
    name: "Bartosz Stromski",
    image: "/authors/BSTRO.jpg",
    github: "https://github.com/Sacharow",
  },
};

export default Hub;
