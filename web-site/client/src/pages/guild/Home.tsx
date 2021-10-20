import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import "./side-bar.css";
import { NavLink } from "react-router-dom";

export const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const makeRequests = async () => {
      if (accessToken) {
        const guildID = window.location.pathname.replace("/guilds/", "");
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
        window.location.href="/login";
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
            <NavLink
              style={{ background: "#00ddff" }}
              to={`/guilds/${guildConfig?.guild_id}`}
            >
              <i className="bx bx-home"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/guilds/${guildConfig?.guild_id}/welcome`}>
              <i className="bx bx-log-in-circle"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/guilds/${guildConfig?.guild_id}/leave`}>
              <i className="bx bx-log-out-circle"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/guilds/${guildConfig?.guild_id}/leveling`}>
              <i className="bx bx-stats"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/guilds/${guildConfig?.guild_id}/logging`}>
              <i className="bx bx-history"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/guilds/${guildConfig?.guild_id}/settings`}>
              <i className="bx bx-cog"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to={`/leaderboard/${guildConfig?.guild_id}`}>
              <i className="bx bx-align-justify"></i>
            </NavLink>
          </li>
          <li>
            <NavLink to="/guilds">
              <i className="bx bx-arrow-back"></i>
              <span className="link_name">Back to Servers List</span>
            </NavLink>
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
                      Server Boost:
                      <b style={{ color: "var(--secondary-text-color)" }}>
                        {" "}
                        {guildConfig?.boost}
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
