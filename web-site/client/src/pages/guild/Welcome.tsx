import React, { useState, useEffect } from "react";
import { User, GuildConfig, TextChannel } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Side } from "../../components/SideBar";

export const Welcome: React.FC = (props) => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [TextChannels, setChannels] = useState<Array<TextChannel> | null>(null);

  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");
  var pathArray = window.location.pathname.split("/");
  const guildID = pathArray[2];
  const handleSubmit = async () => {
    if (!channel || !message) {
      window.alert("Please fill al the forms");
      return;
    }
    const url = `${config.API_URL}/api/changewelcome`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        channel_id: channel,
        message: message,
      },
    }).then((response) => {
      response.json();
      alert("All settings are carefully saved.");
    });
  };

  const EnableWelcome = () => {
    const url = `${config.API_URL}/api/enablewelcome`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
      },
    }).then((response) => {
      response.json();
      window.location.reload();
    });
  };
  const disableWelcome = () => {
    const url = `${config.API_URL}/api/disable`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        action: "welcome",
      },
    }).then((response) => {
      response.json();
      window.location.reload();
    });
  };

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
      } else {
        window.location.href = "/login";
      }
    };
    makeRequests();
  }, [guildID]);
  document.title = `XGN BOT - ${guildConfig?.name}`;
  return (
    <div>
      <Side />
      <section className="home-section" style={{ background: "" }}>
        <div className="container">
          <div className="row">
            <div
              className="card"
              style={{
                background: "var(--background)",
                borderRadius: 30,
                borderColor: "var(--background)",
              }}
              id="welcome"
            >
              <div className="card-body">
                <div>
                  <h2>Welcomeing Members</h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    Give new users a warm welcome!
                  </p>
                  <hr />
                  {!guildConfig?.welcome_enabled ? (
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "var(--secondary)" }}
                        onClick={EnableWelcome}
                      >
                        Enable
                      </button>
                      <br />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="w-c">
                        Select the channel for the welcome message
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
                        <option selected value={guildConfig?.guild_id}>
                          {guildConfig?.welcome_channel}
                        </option>
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
                          <label htmlFor="welcome">
                            Select the message for the welcome event
                          </label>
                          <textarea
                            placeholder={guildConfig?.welcome_message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                              color: "var(--text-color)",
                              background: "#2c2f33",
                            }}
                            id="welcome-message"
                            className="form-control form-control-sm"
                            rows={3}
                          ></textarea>
                        </div>
                        <div className="col-sm-6">
                          <h5>Tip:</h5>
                          use{" "}
                          <b style={{ color: "var(--main-color)" }}>
                            {"{mention}"}
                          </b>{" "}
                          to mention the new member,{" "}
                          <b style={{ color: "var(--main-color)" }}>
                            {"{server}"}
                          </b>{" "}
                          for the server name and{" "}
                          <b style={{ color: "var(--main-color)" }}>
                            {"{members}"}
                          </b>{" "}
                          for the number of the members in the server
                        </div>
                      </div>

                      <hr />
                      <h3>Welcome Image</h3>
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
                              <a
                                href="https://some-random-api.ml/"
                                target="_blank"
                                rel="noreferrer"
                              >
                                powered by some random api
                              </a>
                            }
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <img
                            className="img-container"
                            src={`https://some-random-api.ml/welcome/img/7/stars?type=join&username=${user?.username}&discriminator=${user?.discriminator}&guildName=${guildConfig?.name}&memberCount=${guildConfig?.members}&avatar=${user?.avatar_url}&textcolor=white&key=CEvvlVQ5nEPMsKx7xjZBEbJxc`}
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
                        onClick={disableWelcome}
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
