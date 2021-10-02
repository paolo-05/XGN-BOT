import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";

export const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const guildID = window.location.pathname.replace("/guilds/settings/", "");
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
    console.log(+"\n");
    const url = `${config.API_URL}/api/changeprefix`;
    fetch(url, {
      method: "POST",
      headers: {
        guild_id: guildID,
        prefix: newPrefix,
      },
    })
      .then((response) => response.json())
      .then((resp) => {
        if (resp.status === 200) {
          //window.location.reload();
          console.log("okk");
        } else {
          console.log("Something went wrong");
        }
      });
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
            <div
              onClick={() =>
                (window.location.href = `/guilds/home/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-home"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a className="link_name" href="/home">
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
                <a className="link_name" href="leave">
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
                <a className="link_name" href="leave">
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
                <a className="link_name" href="levling">
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
                <a className="link_name" href="log">
                  Logging
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div
              style={{ background: "#00ddff" }}
              onClick={() =>
                (window.location.href = `/guilds/settings/${guildConfig?.guild_id}`)
              }
            >
              <i className="bx bx-cog"></i>
            </div>
            <ul className="sub-menu blank">
              <li>
                <a className="link_name" href={`/guilds/settings/${guildConfig?.guild_id}`}>
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
