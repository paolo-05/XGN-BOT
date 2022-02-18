import React from "react";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";

export const About: React.FC = () => {
  return (
    <div>
      <NavBar />
      <div className="container" style={{ marginTop: 100 }}>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Alfa Slab One",
              color: "var(--secondary-text-color)",
            }}
          >
            XGN BOT
          </h1>
          <h1>Staff</h1>
        </div>
        <br />
        <div className="row justify-content-center features">
          <div className="col-sm-6">
            <div
              className="card"
              style={{ backgroundColor: "var(--main-color)", borderRadius: 30 }}
            >
              <div className="card-body">
                <h2 style={{ textAlign: "center" }}>paolo#5731</h2>
                <p>
                  <div className="row">
                    <div className="col-sm-4">
                      <img
                        src="https://cdn.discordapp.com/avatars/623570551566237709/692018969f68aefec124ce0114745645.png?size=512"
                        className="rounded-full"
                        alt=""
                        width=""
                      />
                    </div>
                    <div className="col-sm-6">
                      <p>
                        roles:
                        <ul style={{ listStyleType: "circle" }}>
                          <li>He's doing all the work</li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <br />
        <p style={{ textAlign: "center" }}>
          As you saw the staff of the bot is quite empty and I have to do all
          the work by myself. The bot is growing quite fast so the staff is
          doing the same, we need, I need partners to make grow the bot.
          <br />
          If you want to become a staffer of{" "}
          <span
            style={{ color: "var(--main-color)", fontFamily: "Alfa Slab One" }}
          >
            XGN BOT
          </span>{" "}
          make sure to complete the form below.
          <br />
          <br />
          <a
            className="btn btn-primary smoothScroll shadow-none"
            role="button"
            rel="noreferrer"
            target="_blank"
            style={{
              margin: 5,
              backgroundColor: "var(--main-color)",
              borderColor: "var(--main-color)",
              borderRadius: 10,
            }}
            href="https://forms.gle/YNeexcsZoGbF5eNW8"
          >
            BECOME A MEMBER OF THE STAFF!
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
};
