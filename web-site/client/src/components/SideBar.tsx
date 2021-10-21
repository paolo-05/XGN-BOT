import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, GuildConfig } from "../types";
import { NavLink } from "react-router-dom";

import config from "../config.json";

export const Side: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const makeRequests = async () => {
      var pathArray = window.location.pathname.split("/");
      const guildID = pathArray[2];
      const guildsRes = await axios.get(`${config.API_URL}/guilds/${guildID}`, {
        headers: {
          access_token: accessToken,
          guild_id: guildID,
        },
      });
      setGuild(guildsRes.data);
      await new Promise((r) => setTimeout(r, 500));
      const userRes = await axios.get(`${config.API_URL}/users/me`, {
        headers: {
          access_token: accessToken,
        },
      });
      setUser(userRes.data);
    };
    makeRequests();
  }, []);
  return (
    <div className="sidebar">
      <br />
      <div className="logo-details">
        <img
          src={guildConfig?.icon_url}
          alt=""
          width="25%"
          className="rounded-full"
        />
        <span style={{ color: "var(--text-color)" }}>{guildConfig?.name}</span>
      </div>
      <ul className="nav-links">
        <li>
          <NavLink to={`/guilds/${guildConfig?.guild_id}`}>
            <i className="bx bx-home"></i>
            <span style={{ color: "white" }}>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={`/guilds/${guildConfig?.guild_id}/welcome`}>
            <i className="bx bx-log-in-circle"></i>

            <span style={{ color: "white" }}>Welcome</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={`/guilds/${guildConfig?.guild_id}/leave`}>
            <i className="bx bx-log-out-circle"></i>

            <span style={{ color: "white" }}>Leave</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={`/guilds/${guildConfig?.guild_id}/leveling`}>
            <i className="bx bx-stats"></i>

            <span style={{ color: "white" }}>Leveling</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={`/guilds/${guildConfig?.guild_id}/logging`}>
            <i className="bx bx-history"></i>
            <span style={{ color: "white" }}>Logging</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={`/guilds/${guildConfig?.guild_id}/settings`}>
            <i className="bx bx-cog"></i>
            <span style={{ color: "white" }}>Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink to={`/leaderboard/${guildConfig?.guild_id}`}>
            <i className="bx bx-align-justify"></i>
            <span style={{ color: "white" }}>Leaderboard</span>
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
            <NavLink to="/logout">
              <i className="bx bx-log-out"></i>
            </NavLink>
          </div>
        </li>
      </ul>
    </div>
  );
};
