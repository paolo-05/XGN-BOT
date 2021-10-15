import React, { useState, useEffect } from "react";
import { Guild, User } from "../types";
import axios from "axios";

import "./guild/styles.css";

import config from "../config.json";
import { Loading } from "../components/Loading";
import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

export const ShowGuilds: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [guilds, setGuilds] = useState<Array<Guild> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    const makeRequests = async () => {
      if (accessToken) {
        const guildsRes = await axios.get(`${config.API_URL}/guilds`, {
          headers: {
            access_token: accessToken,
          },
        });
        setGuilds(guildsRes.data.guilds);
        await new Promise((r) => setTimeout(r, 500));
        const userRes = await axios.get(`${config.API_URL}/users/me`, {
          headers: {
            access_token: accessToken,
          },
        });
        setUser(userRes.data);
        setLoading(false);
      } else {
        window.location.href = "/login";
      }
    };
    makeRequests();
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="features-boxed" style={{ background: "var(--background" }}>
      <div id="top" style={{ height: 12, background: "var(--background)" }}>
        <nav
          className="navbar navbar-light navbar-expand fixed-top"
          style={{
            color: "var(--main-color)",
            borderTopWidth: 6,
            borderTopStyle: "solid",
            background: "var(--background)",
          }}
        >
          <div className="container-fluid">
            <NavLink
              className="navbar-brand"
              to={"/"}
              style={{
                color: "var(--main-color)",
                fontFamily: "Alfa Slab One",
              }}
            >
              XGN BOT
            </NavLink>
            <button
              data-toggle="collapse"
              className="navbar-toggler"
              data-target="#navcol-1"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navcol-1">
              <ul className="nav navbar-nav">
                <li className="nav-item">
                  <NavLink
                    className="nav-link active smoothScroll"
                    to="/#feature"
                    style={{ color: "var(--text-color)" }}
                  >
                    See Features
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link smoothScroll"
                    to="/commands"
                    style={{ color: "var(--text-color)" }}
                  >
                    Commands
                  </NavLink>
                </li>

                <li className="nav-item">
                  <img
                    src={user?.avatar_url}
                    width="42"
                    alt=""
                    className="rounded-full nav-link"
                  />
                </li>
                <li className="nav-item">
                  <Dropdown>
                    <Dropdown.Toggle
                      style={{
                        background: "var(--background)",
                        border: "none",
                      }}
                    >
                      {user?.username}#{user?.discriminator}
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      variant="dark"
                      style={{ background: "var(--background)" }}
                    >
                      <Dropdown.Item className="nav-link">
                        <NavLink
                          to="/guilds"
                          style={{ color: "var(--text-color)" }}
                        >
                          My servers
                        </NavLink>
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <NavLink
                          to="/logout"
                          style={{
                            color: "var(--text-color)",
                          }}
                        >
                          Logout
                        </NavLink>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="container mx-auto h-screen">
        <div className="flex items-center h-full justify-center">
          <div className="h-3/4">
            <header>
              <h1 className="text-white text-4xl mb-16 text-center">
                XGN BOT dashboard
              </h1>
              <p
                className="text-white text-center"
                style={{ marginBottom: 40 }}
              >
                Here you can see all the server that you can manage:
              </p>
            </header>
            <hr />
            <br />
            <div className="row justify-content-center features">
              {guilds?.map((guild: Guild) => {
                return (
                  <div
                    key={guild.id}
                    className="col-sm-6 col-md-5 col-lg-4 item"
                  >
                    <div
                      className="box"
                      style={{
                        borderRadius: 34,
                        background: "#808080",
                      }}
                    >
                      <div className="flex -mt-16 justify-center">
                        <img
                          className="rounded-full"
                          width="150"
                          src={guild.icon_url}
                          alt=""
                        />
                      </div>
                      <div className="px-6 py-4">
                        <h1 className="text-xl word-break font-semibold text-center">
                          {guild.name}
                        </h1>
                      </div>
                      {guild.in === false ? (
                        <NavLink
                          className="btn btn-primary smoothScroll shadow-none"
                          onClick={() => {
                            window.open(
                              `https://discord.com/oauth2/authorize?client_id=840300480382894080&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`,
                              "Invite",
                              "width=450,height=750"
                            );
                          }}
                          to={"#invite-bot"}
                          role="button"
                          style={{
                            margin: 5,
                            backgroundColor: "var(--main-color)",
                            borderColor: "var(--main-color)",
                            borderRadius: 10,
                          }}
                        >
                          Invite
                        </NavLink>
                      ) : (
                        <NavLink
                          className="btn btn-primary smoothScroll shadow-none"
                          to={`/guilds/${guild.id}`}
                          role="button"
                          style={{
                            margin: 5,
                            backgroundColor: "var(--main-color)",
                            borderColor: "var(--main-color)",
                            borderRadius: 10,
                          }}
                        >
                          Dashboard
                        </NavLink>
                      )}
                    </div>
                    <br />
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
