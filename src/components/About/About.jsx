import "./About.css";

const techIcons = [
  { label: "React", src: "/assets/logos/react.svg" },
  { label: "JavaScript", src: "/assets/logos/javascript.svg" },
  { label: "Tailwind", src: "/assets/logos/tailwindcss.svg" },
  { label: "CSS", src: "/assets/logos/css3.svg" },
  { label: "HTML", src: "/assets/logos/html5.svg" },
  { label: "Git", src: "/assets/logos/git.svg" },
  { label: "Node", src: "/assets/logos/nodejs.svg" },
  { label: "Figma", src: "/assets/logos/figma.svg" },
];

function OrbitIcons() {
  return (
    <div className="about__orbit">
      <div className="about__orbit-core">STACK</div>

      {techIcons.map((item, index) => {
        const angle = (360 / techIcons.length) * index;
        return (
          <div
            key={item.label}
            className="about__orbit-item"
            style={{
              "--angle": angle,
              "--radius": 115,
            }}
          >
            <img src={item.src} alt={item.label} />
          </div>
        );
      })}
    </div>
  );
}

function About() {
  return (
    <section className="about section-spacing" id="about">
      <div className="c-space">
        <div className="about__heading">
          <p className="headtext">About Me</p>
          <h2 className="text-heading">Quem sou e no que eu trabalho</h2>
        </div>

        <div className="about__grid">
          <article className="about__card about__card--bio grid-default-color grid-1">
            <div className="about__image-wrap">
              <img
                src="/assets/about/profile.jpg"
                alt="Foto de perfil"
                className="about__image"
              />
            </div>

            <div className="about__card-content">
              <h3>Lorem Ipsum</h3>
              <p className="subtext">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </article>

          <article className="about__card about__card--stack grid-default-color grid-2">
            <div className="about__stack-copy">
              <h3>My Stack</h3>
              <p className="subtext">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <OrbitIcons />
          </article>

          <article className="about__card about__card--info grid-black-color grid-3">
            <h3>About</h3>
            <p className="subtext">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default About;