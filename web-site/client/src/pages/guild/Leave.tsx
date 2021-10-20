import React, { useState, useEffect } from "react";
import { User, GuildConfig, TextChannel } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import { NavLink } from "react-router-dom";

export const Leave: React.FC = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [TextChannels, setChannels] = useState<Array<TextChannel> | null>(null);
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
        window.location.href="/login";
      }
    };
    makeRequests();
  }, [guildID]);

  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");
  const handleSubmit = async () => {
    if (!channel || !message) {
      window.alert("Please fill al the forms");
      return;
    }
    const url = `${config.API_URL}/api/changeleave`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        channel_id: channel,
        message: message,
      },
    }).then((response) => response.json());
    alert("All settings are carefully saved.");
  };

  const Enableleave = () => {
    const url = `${config.API_URL}/api/enableleave`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
      },
    }).then((response) => response.json());
  };
  const disableleave = () => {
    const url = `${config.API_URL}/api/disable`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        action: "leave",
      },
    }).then((response) => response.json());
    alert("All settings are carefully saved.");
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
            <NavLink
              to={`/guilds/${guildConfig?.guild_id}/leave`}
              style={{ background: "#00ddff" }}
            >
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
            <div
              className="card"
              style={{ background: "var(--background)", borderRadius: 30 }}
              id="leave"
            >
              <div className="card-body">
                <div>
                  <h2>Leave Message</h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    keep note of those dumbs leaving the server
                  </p>
                  <hr />
                  {!guildConfig?.leave_enabled ? (
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "var(--secondary)" }}
                        onClick={Enableleave}
                      >
                        Enable
                      </button>
                      <br />
                    </div>
                  ) : (
                    <div>
                      <p>
                        <label htmlFor="w-c">
                          Select the channel for the leave message
                        </label>
                        <br />

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
                          <option selected>{guildConfig?.leave_channel}</option>
                          {TextChannels?.map((channel: TextChannel) => {
                            return (
                              <option key={channel.id} value={channel.id}>
                                {channel.name}
                              </option>
                            );
                          })}
                        </select>
                        <br />
                        <div className="row">
                          <div className="col-sm-6">
                            <label htmlFor="leave">
                              Select the message for the leave event
                            </label>
                            <textarea
                              placeholder={guildConfig?.leave_message}
                              onChange={(e) => setMessage(e.target.value)}
                              style={{
                                color: "var(--text-color)",
                                background: "#2c2f33",
                              }}
                              id="leave-message"
                              className="form-control form-control-sm"
                              rows={3}
                            ></textarea>
                          </div>
                          <div className="col-sm-6">
                            <h5>Tip:</h5>
                            <p>
                              {" "}
                              use{" "}
                              <b style={{ color: "var(--main-color)" }}>
                                {"{}"}
                              </b>{" "}
                              to mention user who left.
                            </p>
                          </div>
                        </div>
                        <hr />
                      </p>
                      <h3>Leave Image</h3>
                      <div
                        style={{
                          borderRadius: 20,
                          border: 10,
                          background: "#2c2f33",
                          padding: 10,
                        }}
                        className="row"
                      >
                        <div className="col-sm-6">
                          The bot will send an image too
                          <br />{" "}
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--main-color)",
                            }}
                          >
                            {
                              // eslint-disable-next-line
                              <a
                                href="https://some-random-api.ml/"
                                target="_blank"
                              >
                                powered by some random api
                              </a>
                            }
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <img
                            className="img-container"
                            src={`https://some-random-api.ml/welcome/img/7/stars?type=leave&username=${user?.username}&discriminator=${user?.discriminator}&guildName=${guildConfig?.name}&memberCount=${guildConfig?.members}&avatar=${user?.avatar_url}&textcolor=white&key=CEvvlVQ5nEPMsKx7xjZBEbJxc`}
                            alt=""
                          />
                        </div>
                      </div>
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
                        onClick={disableleave}
                      >
                        Disable
                      </button>
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
