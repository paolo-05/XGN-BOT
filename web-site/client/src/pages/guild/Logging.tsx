import React, { useState, useEffect } from "react";
import { User, GuildConfig, TextChannel } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import { NavLink } from "react-router-dom";

export const Logging: React.FC = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [TextChannels, setChannels] = useState<Array<TextChannel> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  var pathArray = window.location.pathname.split("/");
  const guildID = pathArray[2];
  const [channel, setChannel] = useState("");
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

        const channelRes = await axios.get(
          `${config.API_URL}/channels/${guildID}`,
          {
            headers: {
              access_token: accessToken,
              guild_id: guildID,
            },
          }
        );
        setChannels(channelRes.data.channels);
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
  const handleSubmit = async () => {
    if (!channel) {
      window.alert("Please fill al the forms");
      return;
    }
    const url = `${config.API_URL}/api/changelog`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        channel_id: channel,
      },
    }).then((response) => response.json());
  };

  const Enablelogging = () => {
    const url = `${config.API_URL}/api/enablelog`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
      },
    }).then((response) => response.json());
  };
  const disablelogging = () => {
    const url = `${config.API_URL}/api/disable`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        action: "log",
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
            <NavLink
              to={`/guilds/${guildConfig?.guild_id}/logging`}
              style={{ background: "#00ddff" }}
            >
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
            <div
              className="card"
              style={{ background: "var(--background)", borderRadius: 30 }}
              id="logging"
            >
              <div className="card-body">
                <div>
                  <h2>Logging System</h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    keep track of all events on your server
                  </p>
                  {!guildConfig?.log_enabled ? (
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "var(--secondary)" }}
                        onClick={Enablelogging}
                      >
                        Enable
                      </button>
                      <br />
                    </div>
                  ) : (
                    <div>
                      <hr />
                      <label htmlFor="w-c">
                        Select the channel for the logs
                      </label>
                      <select
                        className="form-select form-select-sm mb-3"
                        aria-label=".form-select-lg"
                        onChange={(e) => setChannel(e.target.value)}
                        style={{
                          borderRadius: 10,
                          backgroundColor: "#2c2f33",
                          color: "var(--text-color)",
                          width: 200,
                        }}
                      >
                        <option selected>{guildConfig?.log_channel}</option>
                        {TextChannels?.map((channel: TextChannel) => {
                          return (
                            <option key={channel.id} value={channel.id}>
                              {channel.name}
                            </option>
                          );
                        })}
                      </select>
                      <hr />
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "var(--secondary)" }}
                        onClick={handleSubmit}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "red", float: "right" }}
                        onClick={disablelogging}
                      >
                        Disable
                      </button>
                      <br />
                      <br />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
