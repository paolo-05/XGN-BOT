import React, { useState, useEffect } from "react";
import { GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Side } from "../../components/SideBar";

export const Settings: React.FC = () => {
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
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
      } else {
        window.location.href = "/login";
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
    }).then((response) => {
      response.json();
      alert("All settings are carefully saved.");
    });
  };
  const EnableStats = () => {
    const url = `${config.API_URL}/api/enablewelcome`; //change this
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
  const disableStats = () => {
    const url = `${config.API_URL}/api/disable`; //change this also
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
  document.title = `XGN BOT - ${guildConfig?.name}`;
  return (
    <div>
      <Side />
      <section className="home-section" style={{ background: "#2c2f33" }}>
        <div className="container">
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
            <div className="col-sm-6">
              <div
                className="card"
                style={{ background: "var(--background)", borderRadius: 30 }}
              >
                <div className="card-body">
                  <div>
                    <h2>Server Stats</h2>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--secondary-text-color)",
                      }}
                    >
                      Keep tracking of the number of members in your server by
                      activating this, it will create some voice channels that
                      content all the info of the server.
                    </p>
                    <br />
                    {!1 /*replace this with the real condition*/ ? (
                      <div>
                        <button
                          type="button"
                          className="btn btn-outline-light"
                          style={{ background: "var(--secondary)" }}
                          onClick={EnableStats}
                        >
                          Enable
                        </button>
                        <br />
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        style={{ background: "red" }}
                        onClick={disableStats}
                      >
                        Disable
                      </button>
                    )}
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
