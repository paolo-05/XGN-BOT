import React, { useState, useEffect } from "react";
import { GuildConfig, TextChannel } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Side } from "../../components/SideBar";

export const Leveling: React.FC = (props) => {
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [TextChannels, setChannels] = useState<Array<TextChannel> | null>(null);
  var pathArray = window.location.pathname.split("/");
  const guildID = pathArray[2];
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("");

  const handleSubmit = async () => {
    if (!channel || !message) {
      window.alert("Please fill al the forms");
      return;
    }
    const url = `${config.API_URL}/api/changeleveling`;
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

  const Enableleveling = () => {
    const url = `${config.API_URL}/api/enableleveling`;
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
  const disableleveling = () => {
    const url = `${config.API_URL}/api/disable`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        action: "leveling",
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
              id="leveling"
            >
              <div className="card-body">
                <div>
                  <h2>Leveling System</h2>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    Power up your server with the leveling system
                  </p>
                  <hr />
                  {!guildConfig?.level_up_enabled ? (
                    <div>
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "var(--secondary)" }}
                        onClick={Enableleveling}
                      >
                        Enable
                      </button>
                      <br />
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="w-c">
                        Select the channel for the leveling message
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
                        <option selected>{guildConfig?.level_channel}</option>
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
                          <label htmlFor="leveling">
                            Select the message for the leveling event
                          </label>
                          <textarea
                            placeholder={guildConfig?.level_message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                              color: "var(--text-color)",
                              background: "#2c2f33",
                            }}
                            id="leveling-message"
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
                            {"{level}"}
                          </b>{" "}
                          for the new level
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
                        onClick={disableleveling}
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
