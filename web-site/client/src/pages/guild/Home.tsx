import React, { useState, useEffect } from "react";
import { GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import "./side-bar.css";
import { Side } from "../../components/SideBar";

export const Home: React.FC = () => {
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);

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
      } else {
        window.location.href = "/login";
      }
    };
    makeRequests();
  }, []);

  document.title = `XGN BOT - ${guildConfig?.name}`;

  return (
    <div>
      <Side />
      <section className="home-section" style={{ background: "#2c2f33" }}>
        <div className="container">
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
