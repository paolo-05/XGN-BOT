import React, { useState, useEffect } from "react";
import { Guild } from "../types";
import axios from "axios";

import "./guild/styles.css";

import config from "../config.json";
import { NavLink } from "react-router-dom";
import { NavBar } from "../components/NavBar";

export const ShowGuilds: React.FC = () => {
  const [guilds, setGuilds] = useState<Array<Guild> | null>(null);

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
      } else {
        window.location.href = "/login";
      }
    };
    makeRequests();
  }, []);
  document.title = `XGN BOT - Guilds`;

  return (
    <div className="features-boxed" style={{ background: "var(--background" }}>
      <NavBar />
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
