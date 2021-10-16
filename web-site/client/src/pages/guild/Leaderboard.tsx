import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import "./side-bar.css";
import { NavLink } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Dropdown } from "react-bootstrap";

export const Leaderboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderboard, setLeaderboard] = useState<Array<User> | null>(null);
  const guildID = window.location.pathname.replace("/leaderboard/", "");
  const accessToken = window.localStorage.getItem("access_token");

  useEffect(() => {
    const makeRequests = async () => {
      const userRes = await axios.get(
        `${config.API_URL}/leaderboard/${guildID}`
      );
      setGuild(userRes.data);
      setLeaderboard(userRes.data.leaderboard);
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
      }
    };
    makeRequests();
  }, [guildID, accessToken]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
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
            <NavLink
              className="navbar-brand"
              to={"/"}
              style={{
                color: "var(--main-color)",
                fontFamily: "Alfa Slab One",
              }}
            >
              XGN BOT
            </NavLink>
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
                  <NavLink
                    className="nav-link active smoothScroll"
                    to="/#feature"
                    style={{ color: "var(--text-color)" }}
                  >
                    See Features
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link smoothScroll"
                    to="/commands"
                    style={{ color: "var(--text-color)" }}
                  >
                    Commands
                  </NavLink>
                </li>

                <li className="nav-item">
                  <img
                    src={user?.avatar_url}
                    width="42"
                    alt=""
                    className="rounded-full nav-link"
                  />
                </li>
                <li className="nav-item">
                  <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            background: "var(--background)",
                            border: "none",
                          }}
                        >
                          {user?.username}#{user?.discriminator}
                        </Dropdown.Toggle>

                        <Dropdown.Menu
                          variant="dark"
                          style={{ background: "var(--background)" }}
                        >
                          <Dropdown.Item className="nav-link">
                            <NavLink
                              to="/guilds"
                                style={{ color: "var(--text-color)" }}
                                className="nav-link"
                            >
                              My servers
                            </NavLink>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <NavLink
                              to="/logout"
                              style={{
                                color: "var(--text-color)",
                                }}
                                className="nav-link"
                            >
                              Logout
                            </NavLink>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="container mx-auto h-screen">
        <div className="flex items-center h-full justify-center">
          <div className="h-3/4">
            <h1 style={{ color: "var(--main-color)" }}>{guildConfig?.name}</h1>
            <p>Leaderboard</p>
            <hr />
            <div className="pt-10 pb-14 h-64">
              {leaderboard?.map((user: User) => {
                return (
                  <div className="flex -mt-16 justify-center">
                    <div className="px-6 py-4">
                      <ul className="text-xl  text-center"></ul>
                      <ul className="text-xl  text-center"></ul>
                      <p className="text-xl  text-center">
                        #{user.counter} | {user.username} on level {user.lvl}{" "}
                        with {user.xp} xp.
                        <br />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="var(--secondary)"
          fillOpacity="1"
          d="M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,192C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <Footer />
    </div>
  );
};
