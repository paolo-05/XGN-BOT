import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import "./side-bar.css";

export const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const makeRequests = async () => {
      if (accessToken) {
        const guildID = window.location.pathname.replace("/guilds/home/", "");
        const guildsRes = await axios.get(
          `${config.API_URL}/guilds/${guildID}`,
          {
            headers: {
              access_token: accessToken,
              guild_id: guildID,
            },
          }
        );
        setGuild(guildsRes.data);
        await new Promise((r) => setTimeout(r, 500));
        const userRes = await axios.get(`${config.API_URL}/users/me`, {
          headers: {
            access_token: accessToken,
          },
        });
        setUser(userRes.data);
        setLoading(false);
      } else {
      }
    };
    makeRequests();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="sidebar close">
        <div className="logo-details">
          <i className="bx bx-library"></i>
          <span className="logo_name" style={{ width: "50%", height: "50%" }}>
            XGN BOT
          </span>
        </div>
        <ul className="nav-links">
          <li>
            <div
              style={{ background: "#00ddff" }}
              onClick={() =>
                (window.location.href = `/guilds/home/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-home"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/guilds/home/${guildConfig?.guild_id}`}
                >
                  Server
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              onClick={() =>
                (window.location.href = `/guilds/welcome/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-log-in-circle"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/guilds/welcome/${guildConfig?.guild_id}`}
                >
                  Welcome
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              onClick={() =>
                (window.location.href = `/guilds/leave/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-log-out-circle"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/guilds/leave/${guildConfig?.guild_id}`}
                >
                  Leave
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              onClick={() =>
                (window.location.href = `/guilds/leveling/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-stats"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/guilds/leveling/${guildConfig?.guild_id}`}
                >
                  Leveling System
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              onClick={() =>
                (window.location.href = `/guilds/logging/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-history"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/guilds/logging/${guildConfig?.guild_id}`}
                >
                  Logging
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              onClick={() =>
                (window.location.href = `/guilds/settings/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-cog"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/guilds/setting/${guildConfig?.guild_id}`}
                >
                  Settings
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              onClick={() =>
                (window.location.href = `/leaderboard/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-align-justify"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a
                  className="link_name"
                  href={`/leaderboard/${guildConfig?.guild_id}`}
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/guilds">
              <i className="bx bx-arrow-back"></i>
              <span className="link_name">Back to Servers List</span>
            </a>
            <ul className="sub-menu blank">
              <li>
                <a className="link_name" href="/guilds">
                  Back to Server List
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div className="profile-details">
              <div className="profile-content">
                <img src={user?.avatar_url} alt="" />
              </div>
              <div className="name-job">
                <div className="profile_name">
                  {user?.username}#{user?.discriminator}
                </div>
              </div>
              <a href="/logout">
                <i className="bx bx-log-out"></i>
              </a>
            </div>
          </li>
        </ul>
      </div>
      <section className="home-section" style={{ background: "#2c2f33" }}>
        <div className="container">
          <h1 className="tex-center">{guildConfig?.name}</h1>
          <br />
          <div className="row">
            <div className="col-sm-6">
              <div className="features-boxed" style={{ background: "#2c2f33" }}>
                <div
                  className="card"
                  style={{ borderRadius: 30, background: "#1d1d1e" }}
                  id="info"
                >
                  <div className="card-body text-center">
                    <h1
                      style={{ color: "var(--main-color)", textAlign: "left" }}
                    >
                      Server Info
                    </h1>
                    <p style={{ color: "var(--text-color)" }}>
                      Members:{" "}
                      <b style={{ color: "var(--secondary-text-color)" }}>
                        {" "}
                        {guildConfig?.members}
                      </b>
                    </p>
                    <p style={{ color: "var(--text-color)" }}>
                      Real people:
                      <b style={{ color: "var(--secondary-text-color)" }}>
                        {" "}
                        {guildConfig?.people}
                      </b>
                    </p>
                    <p style={{ color: "var(--text-color)" }}>
                      Bots:
                      <b style={{ color: "var(--secondary-text-color)" }}>
                        {" "}
                        {guildConfig?.bot_count}
                      </b>
                    </p>
                    <p style={{ color: "var(--text-color)" }}>
                      Text Chanels:{" "}
                      <b style={{ color: "var(--secondary-text-color)" }}>
                        {" "}
                        {guildConfig?.text_channels}
                      </b>
                    </p>
                    <p style={{ color: "var(--text-color)" }}>
                      Voice Channels:{" "}
                      <b style={{ color: "var(--secondary-text-color)" }}>
                        {" "}
                        {guildConfig?.voice_channels}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div
                className="card"
                style={{ borderRadius: 30, background: "#1d1d1e" }}
                id="plugins"
              >
                <div className="card-body text-center">
                  <h1 style={{ color: "var(--main-color)", textAlign: "left" }}>
                    Plugins
                  </h1>
                  <p style={{ color: "var(--text-color)" }}>
                    welcome:{" "}
                    {!guildConfig?.welcome_enabled ? (
                      <button
                        style={{ background: "#ff0000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Disabled
                      </button>
                    ) : (
                      <button
                        style={{ background: "#008000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Enabled
                      </button>
                    )}
                  </p>
                  <p style={{ color: "var(--text-color)" }}>
                    Leave:{" "}
                    {!guildConfig?.leave_enabled ? (
                      <button
                        style={{ background: "#ff0000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Disabled
                      </button>
                    ) : (
                      <button
                        style={{ background: "#008000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Enabled
                      </button>
                    )}
                  </p>
                  <p style={{ color: "var(--text-color)" }}>
                    Level system:{" "}
                    {!guildConfig?.level_up_enabled ? (
                      <button
                        style={{ background: "#ff0000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Disabled
                      </button>
                    ) : (
                      <button
                        style={{ background: "#008000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Enabled
                      </button>
                    )}
                  </p>
                  <p style={{ color: "var(--text-color)" }}>
                    Logging:{" "}
                    {!guildConfig?.log_enabled ? (
                      <button
                        style={{ background: "#ff0000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Disabled
                      </button>
                    ) : (
                      <button
                        style={{ background: "#008000" }}
                        type="button"
                        className="btn btn-outline-light"
                      >
                        Enabled
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
