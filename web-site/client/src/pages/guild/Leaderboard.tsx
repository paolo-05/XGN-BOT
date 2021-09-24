import React, { useState, useEffect } from "react";
import { User, GuildConfig } from "../../types";
import axios from "axios";

import config from "../../config.json";
import { Loading } from "../../components/Loading";
import "./side-bar.css";

export const Leaderboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [guildConfig, setGuild] = useState<GuildConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [leaderboard, setLeaderboard] = useState<Array<User> | null>(null);
  const guildID = window.location.pathname.replace("/leaderboard/", "");
  console.log(guildID);

  useEffect(() => {
    const makeRequests = async () => {
      const userRes = await axios.get(
        `${config.API_URL}/leaderboard/${guildID}`
      );
      setGuild(userRes.data);
      setLeaderboard(userRes.data.leaderboard);
      setLoading(false);
    };
    makeRequests();
  }, [guildID]);

  if (loading) {
    return <Loading />;
  }
  console.log(user);

  return (
    <div className="container mx-auto h-screen">
      <div className="flex items-center h-full justify-center">
        <div className="h-3/4">
          <h1 style={{ color: "var(--main-color)" }}>{guildConfig?.name}</h1>
          <p>Leaderboard</p>
          <hr />
          <div className="pt-10 pb-14 h-64">
            {leaderboard?.map((user: User) => {
              return (
                <div className="flex -mt-16 justify-center">
                  <div className="px-6 py-4">
                    <ul className="text-xl  text-center"></ul>
                    <ul className="text-xl  text-center"></ul>
                    <p className="text-xl  text-center">
                      #{user.counter} | {user.username} on level {user.lvl} with {user.xp} xp.
                      <br />
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 mr-5 mt-5">
            <div className="flex items-center gap-2 text-center">
              <a href={"/"}>Back to Index</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
