import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import "./side-bar.css";

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
    </div>
  );
};
