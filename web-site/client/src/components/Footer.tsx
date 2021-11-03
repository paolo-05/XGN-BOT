import React from "react";

export const Footer: React.FC = () => {
  return (
    <div
      className="footer-dark"
      style={{
        background: "var(--secondary)",
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <div
              className="card"
              style={{
                background: "var(--main-color)",
                borderColor: "var(--main-color)",
              }}
            >
              <div className="card-body">
                <a href="#top">
                  <h2
                    style={{
                      fontFamily: "Alfa Slab One",
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    XGN BOT
                  </h2>
                </a>
                <p style={{ color: "var(--text-color)" }}>
                  designed by paolo#5731 with{" "}
                  <i className="bx bxs-heart" style={{ color: "#ff0000" }}></i>
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div
              className="card"
              style={{
                background: "var(--main-color)",
                borderColor: "var(--main-color)",
              }}
            >
              <div className="card-body">
                <h4>Links:</h4>
                <p>
                  <ul>
                    <li>
                      <a href="/about" style={{color: "var(--text-color)", textDecoration:"none"}}>🔍 | About</a>
                    </li>
                    <li>
                      <a
                        href="https://discord.gg/8V62RTS25Q"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: "var(--text-color)",
                          textDecoration: "none",
                        }}
                      >
                        🆘 | Support Guild
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://discord.gg/kzDM85gXKB"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: "var(--text-color)",
                          textDecoration: "none",
                        }}
                      >
                        🦸‍♂️ | Community Server
                      </a>
                    </li>
                    <li>
                      <a
                        href="/privacy#top"
                        style={{
                          color: "var(--text-color)",
                          textDecoration: "none",
                        }}
                      >
                        🔏| Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://stats.uptimerobot.com/8gl1PCXOr7"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: "var(--text-color)",
                          textDecoration: "none",
                        }}
                      >
                        <img
                          className="d-inline-block align-text-top"
                          alt=""
                          src="assets/uptimerobot-logo.svg"
                          width="20"
                        />
                        {" | "}
                        Service Status
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://primebots.it/bots/840300480382894080/vote"
                        style={{
                          color: "var(--text-color)",
                          textDecoration: "none",
                        }}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <img
                          className="d-inline-block align-text-top"
                          alt=""
                          src="assets/prime_bots.svg"
                          width="20"
                        />
                        {" | "}
                        Vote
                      </a>
                    </li>
                  </ul>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <h6 style={{ textAlign: "center" }}>XGN BOT © 2021</h6>
        <h6 style={{ textAlign: "center" }}>
          not affiliated with{" "}
          <a
            href="https://discord.com"
            style={{ textDecoration: "none", color: "var(--secondary-color)" }}
          >
            discord.com
          </a>
        </h6>
      </div>
    </div>
  );
};
