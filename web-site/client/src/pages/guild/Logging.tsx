import React, { useState, useEffect } from "react";
import { GuildConfig, TextChannel } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Side } from "../../components/SideBar";

export const Logging: React.FC = (props) => {
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [TextChannels, setChannels] = useState<Array<TextChannel> | null>(null);
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
      } else {
        window.location.href = "/login";
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
    alert("All settings are carefully saved.");
  };

  const Enablelogging = () => {
    const url = `${config.API_URL}/api/enablelog`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
      },
    }).then((response) => response.json());
    window.location.reload();
  };
  const disablelogging = () => {
    const url = `${config.API_URL}/api/disable`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        action: "log",
      },
    }).then((response) => {
      response.json();
      window.location.reload();
    });
  };

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
