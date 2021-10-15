import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types";
import { NavLink } from "react-router-dom";

import config from "../config.json";
import { Loading } from "../components/Loading";
import "./guild/styles.css";
import { Footer } from "../components/Footer";

export const Commands: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken) {
      axios
        .get(`${config.API_URL}/users/me`, {
          headers: {
            access_token: accessToken,
          },
        })
        .then((resp) => {
          const user: User = resp.data;
          setUser(user);
          setLoading(false);
        })
        .catch((e) => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <style></style>
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
                  <NavLink
                    className="nav-link smoothScroll"
                    onClick={() => {
                      window.open(
                        "https://cutt.ly/XGNbot",
                        "Invite",
                        "width=450,height=750"
                      );
                    }}
                    style={{ color: "var(--text-color)" }}
                    to={"/commands"}
                  >
                    Invite
                  </NavLink>
                </li>
                <li className="nav-item">
                  {!accessToken ? (
                    <NavLink
                      className="nav-link smoothScroll"
                      to="/login"
                      style={{ color: "var(--text-color)" }}
                    >
                      Login
                    </NavLink>
                  ) : (
                    <NavLink
                      className="nav-link smoothScroll"
                      to="/guilds"
                      style={{ color: "var(--text-color)" }}
                    >
                      Dashboard
                    </NavLink>
                  )}
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link smoothScroll"
                    href="https://discord.gg/8V62RTS25Q"
                    style={{ color: "var(--text-color)" }}
                  >
                    Support Guild
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div
        className=""
        style={{
          textAlign: "left",
          margin: 55,
          color: "var(--text-color)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "var(--main-color)" }}>Commands</h1>
          <p>
            <b>Note: </b>all the commands are available in all servers, there's
            not and will never be a premium version for the bot.
          </p>
        </div>
        <br />
        <div style={{ background: "var(--background)" }}>
          <div>
            <h3 style={{ color: "var(--secondary-text-color)" }}>
              Levelling Commands
            </h3>

            <p>
              !rank [optional(user)] - send the user rank, level, xp <br />{" "}
              !leaderboard - see the server's leaderboard.
            </p>
          </div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>Fun Commands</h3>

          <p>
            !hello - the bot says hello <br />
            !slap [member] [reason] - slaps a member
            <br />
            !echo - repeat a message (no @everyone/@here allowed)
            <br />
            !meme - send a random meme
            <br />
            !token - send a 100% real discord token
            <br />
            !fatc [animal] - send a random fact about an animal and a cute image
          </p>
        </div>
        <div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>
            Fun Images Commands
          </h3>
          <div>
            <p>
              !gay [optional(member)] - creates an image with the LGBTQI+XSXWWSD
              overlay
              <br />
              !wasted [optional(member)] - creates an image with the GTA wasted
              overlay
              <br />
              !capture [optional(member)] - creates an image with a jail
              <br />
              !triggered [optional(member)] - creates a gif with the triggered
              overlay
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>
            Games Commands
          </h3>
          <div>
            <p>
              !tictactoe [opponent] - creates an instance of a tic tac toe game{" "}
            </p>
            <p>
              !rps - creates a game of rock paper scissors(the opponent is the
              computer)
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>
            Music Commands
          </h3>
          <div>
            <p>
              !connect [channel] - connect to a voice channel
              <br />
              !disconnect|leave - disconnect from a voice channel
              <br />
              !play [query] - play a song by a url or a keyword
              <br />
              !pause - pause the current song.
              <br />
              !stop - stop playback
              <br />
              !next|skip - skip playback
              <br />
              !previous - plays the previous track
              <br />
              !shuffle - shuffles the queue
              <br />
              !clear_queue - clear the queue
              <br />
              !loop [mode] - enables the looping of music
              <br />
              !queue [show] - shows the queue
              <br />
              !volume [volume] - set the volume
              <br />
              !lyrics [name] - lyrics
              <br />
              !eq [preset] - set the type of the equalizer
              <br />
              !playing|np - shows the current playback
              <br />
              !skipto|playindex [index] - go to a specific track in the queue.
              <br />
              !restart - estart the song.
              <br />
              !seek [position] - seek the queue
              <br />
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>
            Dictionary Commands
          </h3>
          <p>
            !urban [query] - the bot sends the explanation of the word in the
            query (due to an api problem you need to use a NSFW channel to
            perform this command).
          </p>
        </div>
        <div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>
            Meta/Info Commands
          </h3>
          <div>
            <p>
              !info [optional(user)] : see the user info like join date in
              server, the roles, the permissions, the ID, the rank, the xp, and
              the level
              <br />
              !server : see the server info like the name, the image, the number
              of members, the number of textual channels and the vocal ones, you
              can see the also the most active member based on the xp
              <br />
              !ping : see the ping of the bot
              <br />
              !stats : see the stats of the bot
              <br />
              !about : sends a little embed with some util links
            </p>
          </div>
        </div>
        <div>
          <h3 style={{ color: "var(--secondary-text-color)" }}>
            Moderation Commands
          </h3>
          <div>
            <p>
              !purge [n] : deletes a number of messages
              <br />
              !warn [user] [reason] : wars an user
              <br />
              !warnings [user] : see the warnings for an user
              <br />
              !kick [user] [reason] : kick a user from the server
              <br />
              !ban [user] : ban a user from the server
            </p>
          </div>
        </div>
      </div>
      <br />
      <div id="feature" style={{ height: 90, background: "var(--secondary)" }}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="var(--background)"
              fillOpacity="1"
              d="M0,96L40,112C80,128,160,160,240,144C320,128,400,64,480,48C560,32,640,64,720,69.3C800,75,880,53,960,58.7C1040,64,1120,96,1200,96C1280,96,1360,64,1400,48L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>
      <Footer />
    </div>
  );
};
