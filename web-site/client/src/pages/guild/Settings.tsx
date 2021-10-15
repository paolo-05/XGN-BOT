import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import { NavLink } from "react-router-dom";

export const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  var pathArray = window.location.pathname.split("/");
  const guildID = pathArray[2];
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const makeRequests = async () => {
      if (accessToken) {
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
  }, [guildID]);

  const [newPrefix, setPrefix] = useState("");

  const handleSubmit = async () => {
    if (!newPrefix) {
      window.alert("Please fill al the forms");
      return;
    }
    const url = `${config.API_URL}/api/changeprefix`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        prefix: newPrefix,
      },
    }).then((response) => response.json());
  };

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
            <NavLink to={`/guilds/${guildConfig?.guild_id}`}>
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
            <NavLink
              to={`/guilds/${guildConfig?.guild_id}/settings`}
              style={{ background: "#00ddff" }}
            >
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
              <div
                className="card"
                style={{ background: "var(--background)", borderRadius: 30 }}
              >
                <div className="card-body">
                  <div className="prefix">
                    <h2>Prefix</h2>
                    <br />
                    <label htmlFor="prefix">
                      Select the prefix for the server
                    </label>
                    <input
                      placeholder={guildConfig?.prefix}
                      type="text"
                      maxLength={5}
                      id="prefix"
                      className="form-control"
                      onChange={(e) => setPrefix(e.target.value)}
                      style={{
                        width: 200,
                        color: "var(--text-color)",
                        background: "#2c2f33",
                      }}
                    />
                    <hr />
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      style={{ background: "var(--secondary)", float: "left" }}
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
