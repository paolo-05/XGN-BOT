import React, { useEffect, useState } from "react";
import axios from "axios";
import { Status } from "../types";

import config from "../config.json";
import { Footer } from "../components/Footer";
import "./guild/styles.css";
import { NavLink } from "react-router-dom";
import { NavBar } from "../components/NavBar";

export const Homepage: React.FC = () => {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    axios.get(`${config.BOT_API_URL}/status`).then((resp) => {
      setStatus(resp.data);
    });
  }, []);
  document.title = `XGN BOT`;
  return (
    <div>
      <NavBar />
      <header
        className="container"
        style={{
          height: 418,
          textAlign: "left",
          marginTop: 55,
          alignItems: "left",
        }}
      >
        <div className="row">
          <div className="col-sm-6 col-md-5 col-lg-4 item">
            <h1
              className=""
              style={{
                color: "var(--text-color)",
                textAlign: "left",
              }}
            >
              Build the best Discord Server!
            </h1>
            <p
              style={{
                color: "var(--secondary-text-color)",
              }}
            >
              Configure welcome, levelling, logging and more with the most easy
              to use dashboard
            </p>
            <div style={{ alignItems: "center" }}>
              <div role="group" className="btn-group">
                <NavLink
                  className="btn btn-primary shadow-none"
                  type="button"
                  style={{
                    margin: 5,
                    backgroundColor: "var(--main-color)",
                    borderColor: "var(--main-color)",
                    borderRadius: 10,
                  }}
                  to="/guilds"
                >
                  Invite Me
                </NavLink>

                <a
                  className="btn btn-primary smoothScroll shadow-none"
                  role="button"
                  style={{
                    margin: 5,
                    backgroundColor: "grey",
                    borderColor: "grey",
                    borderRadius: 10,
                  }}
                  href="#feature"
                >
                  See Features
                </a>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-md-5 col-lg-4 item center">
            <h3>Bot Stats</h3>
            Status:{" "}
            <h6
              className={`bg-${
                status ? "green" : "red"
              }-500 text-white font-bold py-2 px-4 rounded`}
              style={{ width: 100 }}
            >
              {status ? "Online" : "Offline"}
            </h6>
            Servers: {status ? status.guilds : "N/A"}
            <br />
            Ping: {status ? status.ping : "N/A"}
          </div>
        </div>
      </header>
      <div
        className="features-boxed"
        style={{ background: "#2c2f33", borderRadius: "0" }}
        id="features"
      >
        <div className="container" style={{ color: "var(--main-color)" }}>
          <h1 className="center">Why XGN BOT?</h1>
          <div className="row justify-content-center features">
            <div className="col-sm-6 item">
              <div id="features" className="box" style={{ borderRadius: 34 }}>
                <i
                  className="bx bx-log-in-circle"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Say Hi To New Members</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  Take advantage of the welcome message to inform new users
                  about your server rules, topic, or ongoing events.
                  <br />
                  The bot has a custom image for welcoming the users.
                </p>
              </div>
            </div>
            <div className="col-sm-6 item">
              <img
                className="img-container img-res"
                src="/assets/welcome.png"
                alt=""
              />
            </div>
          </div>
          <div className="row justify-content-center features">
            <div className="col-sm-6 item">
              <img
                className="img-container img-res"
                src="/assets/levels.png"
                alt=""
              />
            </div>
            <div className="col-sm-6 item">
              <div id="features" className="box">
                <i
                  className="bx bx-stats"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Levelling System</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  Gamers love to grind. Use our leveling system to identify and
                  reward the most active members of your community. Let them
                  show off a cool customizable rank card and compete for the
                  mighty first spot of your leaderboard!
                  <br />
                  <br />
                  Automatically give roles when they reach a certain level to
                  reward the most active members with access to exclusive
                  channels and privileged permissions.
                  <br />
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center features">
            <div className="col-sm-6 item">
              <div id="features" className="box">
                <i
                  className="bx bx-music"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Music</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  Share music with your friends in discord with the music plugin
                  wich has the best quality available.
                  <br />
                </p>
              </div>
            </div>
            <div className="col-sm-6 item">
              <img
                src="/assets/music.png"
                className="img-container img-res"
                alt=""
              />
            </div>
          </div>
          <div className="row justify-content-center features">
            <div className="col-sm-6 item">
              <img
                src="/assets/tris.png"
                alt=""
                className="img-container  img-res"
              />
            </div>
            <div className="col-sm-6 item">
              <div id="features" className="box">
                <i
                  className="bx bx-happy-alt"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Fun</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  Borded? The bot has a lot fun commands, for memes, random
                  facts, also it has a nice Tic Tac Toe command that lets you
                  play the n°1 game to avoid boredom.
                  <br />
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center features">
            <div className="col-sm-6 item">
              <div id="features" className="box">
                <i
                  className="bx bxs-graduation"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Moderation</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  Easly moderate your server with the bot's moderation plugin.
                </p>
              </div>
            </div>
            <div className="col-sm-6 item">
              <img
                src="/assets/mod.png"
                alt=""
                className="img-container img-res"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <section>
          <div className="container-fluid text-white">
            <div
              className="row row-cols-3 justify-content-center"
              style={{
                color: "var(--secondary-text-color)",
                background: "#808080",
              }}
            >
              <div className="col-auto col-md-6 col-lg-4 text-center pb-5 pt-5 number-item love_counter">
                <h3>Trusted by over {status?.guilds} servers.</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="container">
        <div
          style={{
            background: `url(/assets/leaves.png)`,
            height: 366,
          }}
          className="img-container d-xl-flex flex-column justify-content-xl-center align-items-xl-center"
        >
          <br />
          <h1 className="text-center">
            Personalize your own Discord server <br />
            today for free
          </h1>
          <br />
          <p>
            <NavLink
              className="btn btn-primary shadow-none"
              type="button"
              style={{
                margin: 25,
                backgroundColor: "var(--main-color)",
                borderColor: "var(--main-color)",
                borderRadius: 10,
                alignItems: "center",
              }}
              to="/guilds"
            >
              Add to Discord
            </NavLink>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};
