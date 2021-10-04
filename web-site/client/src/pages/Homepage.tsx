import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Status } from "../types";

import config from "../config.json";
import { Loading } from "../components/Loading";
import "./guild/styles.css";

export const Homepage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<Status | null>(null);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    axios.get(`${config.BOT_API_URL}/status`).then((resp) => {
      setStatus(resp.data);
    });

    if (accessToken) {
      axios
        .get(`${config.API_URL}/users/me`, {
          headers: {
            access_token: accessToken,
          },
        })
        .then((resp) => {
          const user: User = resp.data;
          setUser(user);
          setLoading(false);
        })
        .catch((e) => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <style></style>
      <div id="top" style={{ height: 12, background: "var(--background)" }}>
        <nav
          className="navbar navbar-light navbar-expand fixed-top"
          style={{
            color: "var(--main-color)",
            borderTopWidth: 6,
            borderTopStyle: "solid",
            background: "var(--background)",
          }}
        >
          <div className="container-fluid">
            <a
              className="navbar-brand"
              href={"/"}
              style={{
                color: "var(--main-color)",
                fontFamily: "Alfa Slab One",
              }}
            >
              XGN BOT
            </a>
            <button
              data-toggle="collapse"
              className="navbar-toggler"
              data-target="#navcol-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navcol-1">
              <ul className="nav navbar-nav">
                <li className="nav-item">
                  <a
                    className="nav-link active smoothScroll"
                    href="#feature"
                    style={{ color: "var(--text-color)" }}
                  >
                    See Features
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link smoothScroll"
                    href="/commands"
                    style={{ color: "var(--text-color)" }}
                  >
                    Commands
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link smoothScroll"
                    onClick={() => {
                      window.open(
                        "https://cutt.ly/XGNbot",
                        "Invite",
                        "width=450,height=750"
                      );
                    }}
                    style={{ color: "var(--text-color)" }}
                    href={"/"}
                  >
                    Invite
                  </a>
                </li>
                <li className="nav-item">
                  {!accessToken ? (
                    <a
                      className="nav-link smoothScroll"
                      href="/login"
                      style={{ color: "var(--text-color)" }}
                    >
                      Login
                    </a>
                  ) : (
                    <a
                      className="nav-link smoothScroll"
                      href="/guilds"
                      style={{ color: "var(--text-color)" }}
                    >
                      Dashboard
                    </a>
                  )}
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link smoothScroll"
                    href="https://discord.gg/8V62RTS25Q"
                    style={{ color: "var(--text-color)" }}
                  >
                    Support Guild
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <header
        className="d-xl-flex flex-column justify-content-xl-center align-items-xl-center"
        style={{
          height: 418,
          textAlign: "center",
          margin: 55,
          alignItems: "center",
        }}
      >
        <img
          className="rounded center"
          src="https://cdn.discordapp.com/attachments/785971390977277992/894499601590128640/logo.png"
          width="150"
          height="150"
          style={{ marginTop: 30 }}
          alt=""
        />
        <h1
          className="d-xl-flex justify-content-xl-start"
          style={{ color: "var(--text-color)" }}
        >
          XGN BOT
        </h1>
        <p style={{ color: "var(--secondary-text-color)" }}>
          a bot full of features,
          <br /> a complete web-dashboard, it has a levelling system,
          <br />
          some fun commands and a pretty good moderation
        </p>
        <div className="tada animated">
          <div role="group" className="btn-group">
            <a
              onClick={() => {
                window.open(
                  "https://cutt.ly/XGNbot",
                  "Invite",
                  "width=450,height=750"
                );
              }}
              className="btn btn-primary shadow-none"
              type="button"
              style={{
                margin: 5,
                backgroundColor: "var(--main-color)",
                borderColor: "var(--main-color)",
                borderRadius: 10,
              }}
              href={"/"}
            >
              Invite Me
            </a>

            <a
              className="btn btn-primary smoothScroll shadow-none"
              role="button"
              style={{
                margin: 5,
                backgroundColor: "var(--main-color)",
                borderColor: "var(--main-color)",
                borderRadius: 10,
              }}
              href="#feature"
            >
              See Features
            </a>
          </div>
        </div>
        <div className="tada animated">
          <div role="group" className="btn-group">
            <a
              className="btn btn-primary smoothScroll shadow-none"
              role="button"
              style={{
                margin: 5,
                backgroundColor: "var(--main-color)",
                borderColor: "var(--main-color)",
                borderRadius: 10,
              }}
              href="https://discord.gg/8V62RTS25Q"
            >
              Support Guild
            </a>
            {!accessToken ? (
              <a
                className="btn btn-primary smoothScroll shadow-none"
                href="/login"
                role="button"
                style={{
                  margin: 5,
                  backgroundColor: "var(--main-color)",
                  borderColor: "var(--main-color)",
                  borderRadius: 10,
                }}
              >
                Login
              </a>
            ) : (
              <a
                className="btn btn-primary smoothScroll shadow-none"
                href="/guilds"
                role="button"
                style={{
                  margin: 5,
                  backgroundColor: "var(--main-color)",
                  borderColor: "var(--main-color)",
                  borderRadius: 10,
                }}
              >
                Dashboard
              </a>
            )}
          </div>
        </div>
      </header>
      <div id="feature" style={{ height: 90, background: "var(--secondary)" }}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="var(--background)"
              fillOpacity="1"
              d="M0,96L40,112C80,128,160,160,240,144C320,128,400,64,480,48C560,32,640,64,720,69.3C800,75,880,53,960,58.7C1040,64,1120,96,1200,96C1280,96,1360,64,1400,48L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>
      <div
        className="features-boxed"
        style={{ background: "var(--secondary)" }}
      >
        <div className="container" style={{ color: "var(--main-color)" }}>
          <div className="intro">
            <h2 className="text-center" style={{ color: "var(--text-color)" }}>
              XGN BOT Features
            </h2>
          </div>
          <div className="row justify-content-center features">
            <div className="col-sm-6 col-md-5 col-lg-4 item">
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
                  <br />
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
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
            <div className="col-sm-6 col-md-5 col-lg-4 item">
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
            <div className="col-sm-6 col-md-5 col-lg-4 item">
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
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div id="features" className="box">
                <i
                  className="bx bx-code-alt"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Slash Commands</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  For all the times you missed the prefix of a bot and the
                  entire server has bullied you.
                  <br />
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
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
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div id="features" className="box">
                <i
                  className="bx bx-list-ul"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Web Dashboard</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  Tired of setting up all the bot features via commands, thanks
                  to the XGN BOT Web Dashboard you won't have to do it again.
                </p>
              </div>
            </div>
            <div className="col-sm-6 col-md-5 col-lg-4 item">
              <div id="features" className="box">
                <i
                  className="bx bxs-time-five"
                  style={{ fontSize: 64, margin: 10 }}
                ></i>
                <h3 className="name">Getting Started</h3>
                <p
                  className="description"
                  style={{ color: "var(--secondary-text-color)" }}
                >
                  The bot has a lot of event handler, so you can't use commands
                  wrong. It has a change log event, you can setup the channel in
                  your server!
                  <br />
                  Also you have to setup the welcome channel and the one for the
                  level up.
                  <br />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div style={{ background: "var(--background)" }}>
        <div style={{ height: 150, overflow: "hidden" }}>
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            style={{ height: "100%", width: "100%" }}
          >
            <path
              d="M-41.53,-9.56 C167.83,173.98 302.14,-60.89 534.09,89.10 L500.00,0.00 L0.00,0.00 Z"
              style={{ stroke: "none", fill: "var(--secondary)" }}
            ></path>
          </svg>
        </div>
      </div>
      <div id="commands">
        <section>
          <div className="container-fluid text-white">
            <div
              className="row row-cols-3 justify-content-center"
              style={{ color: "var(--secondary-text-color)" }}
            >
              <div className="col-auto col-md-6 col-lg-4 text-center pb-5 pt-5 number-item love_counter">
                <h1 className="love_count" style={{ fontSize: 70 }}>
                  <strong>{status?.guilds}</strong>
                </h1>
                <h4 style={{ color: "var(--main-color)", marginTop: -6 }}>
                  Total Servers
                </h4>
              </div>
              <div className="col-auto col-lg-4 text-center align-self-center pb-5 pt-5 love_counter">
                <h1 className="love_count" style={{ fontSize: 70 }}>
                  <strong>{status?.users}</strong>
                </h1>
                <h4 style={{ color: "var(--main-color)", marginTop: -6 }}>
                  Total Users
                </h4>
              </div>
              <div className="col-auto col-lg-4 text-center align-self-center pb-5 pt-5 love_counter">
                <h1 style={{ fontSize: 70 }}>
                  <strong>{status?.ping} ms</strong>
                </h1>
                <h4 style={{ color: "var(--main-color)", marginTop: -6 }}>
                  Latency
                </h4>
              </div>
            </div>
          </div>
        </section>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="var(--secondary)"
          fillOpacity="1"
          d="M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,192C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <div
        className="footer-dark"
        style={{
          background: "var(--secondary)",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div
          className="container"
          style={{
            background: "#2c2f33",
            borderRadius: 34,
            textAlign: "center",
          }}
        >
          <h1>Ready to start?</h1>
          <div role="group" className="btn-group">
            <div className="tada animated">
              <div role="group" className="btn-group">
                <a
                  href="https://cutt.ly/XGNbot"
                  className="btn btn-primary shadow-none"
                  type="button"
                  style={{
                    margin: 5,
                    backgroundColor: "#7289da",
                    borderColor: "#7289da",
                    borderRadius: 10,
                  }}
                >
                  Invite Me
                </a>
              </div>
            </div>
          </div>
          <h3>Or</h3>
          <div role="group" className="btn-group">
            <div className="tada animated">
              <div role="group" className="btn-group">
                <a
                  href="https://discord.gg/8V62RTS25Q"
                  className="btn btn-primary shadow-none"
                  type="button"
                  style={{
                    margin: 5,
                    backgroundColor: "#7289da",
                    borderColor: "#7289da",
                    borderRadius: 10,
                  }}
                >
                  Join Support Guild
                </a>
              </div>
            </div>
          </div>
        </div>
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
              <div className="col item social">
                <a className="smoothScroll" href="#top">
                  <i className="icon ion-android-arrow-up" ></i>
                </a>
              </div>
            </div>
            <p className="copyright" style={{ color: "var(--text-color)" }}>
              XGN BOT © 2021
            </p>
            <p
              className="copyright"
              style={{ color: "var(--text-color)", padding: 0 }}
            >
              Need help?&nbsp;
              <a style={{ color: "#bbb" }} href="https://discord.gg/8V62RTS25Q">
                Support Guild
              </a>
            </p>
            <p
              className="copyright"
              style={{ color: "var(--text-color)", padding: 0 }}
            >
              made with <i className="bx bxs-heart"></i>, React and python.{" "}
              <br />
              Not affiliated with discord.com
              <br/>
              <a style={{ color: "var(--text-color)"}} href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
