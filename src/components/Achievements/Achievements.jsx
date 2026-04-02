import { FiAward, FiTarget, FiStar, FiZap, FiCode, FiBriefcase } from "react-icons/fi";
import "./Achievements.css";

const achievements = [
  {
    icon: FiAward,
    title: "Lorem Award",
    year: "2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero.",
  },
  {
    icon: FiStar,
    title: "Top Contributor",
    year: "2023",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam.",
  },
  {
    icon: FiTarget,
    title: "Project Excellence",
    year: "2023",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nisi nulla quis sem.",
  },
  {
    icon: FiZap,
    title: "Performance Champion",
    year: "2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sagittis ipsum praesent mauris.",
  },
  {
    icon: FiBriefcase,
    title: "Leadership Award",
    year: "2025",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce nec tellus sed augue semper.",
  },
  {
    icon: FiCode,
    title: "Code Quality Master",
    year: "2024",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris massa vestibulum lacinia.",
  },
];

function Achievements() {
  return (
    <section className="achievements section-spacing" id="achievements">
      <div className="c-space">
        <div className="achievements__heading">
          <p className="headtext">Achievements</p>
          <h2 className="text-heading">Destaques e conquistas</h2>
        </div>

        <div className="achievements__grid">
          {achievements.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="achievements__card">
                <div className="achievements__icon-wrap">
                  <Icon className="achievements__icon" />
                </div>

                <h3 className="achievements__title">{item.title}</h3>
                <span className="achievements__year">{item.year}</span>
                <p className="achievements__description">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Achievements;