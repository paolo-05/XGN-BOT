import React, { useState, useEffect } from "react";
import { Guild, User } from "../types";
import axios from "axios";

import "./guild/styles.css";

import config from "../config.json";
import { Loading } from "../components/Loading";

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
      }
    };
    makeRequests();
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="features-boxed" style={{ background: "var(--background" }}>
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
                        <a
                          className="btn btn-primary smoothScroll shadow-none"
                          onClick={() => {
                            window.open(
                              `https://discord.com/oauth2/authorize?client_id=840300480382894080&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`,
                              "Invite",
                              "width=450,height=750"
                            );
                            window.location.reload();
                          }}
                          href={"#invite-bot"}
                          role="button"
                          style={{
                            margin: 5,
                            backgroundColor: "var(--main-color)",
                            borderColor: "var(--main-color)",
                            borderRadius: 10,
                          }}
                        >
                          Invite
                        </a>
                      ) : (
                        <a
                          className="btn btn-primary smoothScroll shadow-none"
                          href={`/guilds/home/${guild.id}`}
                          role="button"
                          style={{
                            margin: 5,
                            backgroundColor: "var(--main-color)",
                            borderColor: "var(--main-color)",
                            borderRadius: 10,
                          }}
                        >
                          Dashboard
                        </a>
                      )}
                    </div>
                    <br />
                    <br />
                  </div>
                );
              })}
            </div>
            <div className="absolute top-0 right-0 mr-5 mt-5">
              <div className="flex items-center gap-2">
                <ul>
                  <li>
                    <img
                      src={user?.avatar_url}
                      width="50"
                      alt=""
                      className="rounded-full"
                    />
                    <h1 className="text-white text-lg">
                      {user?.username}#{user?.discriminator}
                    </h1>
                  </li>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/logout">Logout</a>
                  </li>
                </ul>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
