import React, { useState, useEffect } from "react";
import { User, Server } from "../../types";
import axios from "axios";
import config from "../../config.json";
import "./side-bar.css";
import { NavBar } from "../../components/NavBar";

export const Leaderboard: React.FC = () => {
  const [Server, setGuild] = useState<Server | null>(null);
  const [leaderboard, setLeaderboard] = useState<Array<User> | null>(null);

  useEffect(() => {
    const makeRequests = async () => {
      const guildID = window.location.pathname.replace("/leaderboard/", "");
      const userRes = await axios.get(
        `${config.API_URL}/leaderboard/${guildID}`
      );
      setGuild(userRes.data);
      setLeaderboard(userRes.data.leaderboard);
    };
    makeRequests();
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container mx-auto h-screen">
        <div className="flex items-center h-full justify-center">
          <div className="h-3/4">
            <h1 style={{ color: "var(--main-color)" }}>{Server?.name}</h1>
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
                        #{user.counter} | {user.username} on level {user.lvl}{" "}
                        with {user.xp} xp.
                        <br />
                      </p>
                    </div>
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
