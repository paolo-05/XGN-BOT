import React from "react";

import "./guild/styles.css";
import { Footer } from "../components/Footer";
import { NavBar } from "../components/NavBar";

export const Commands: React.FC = () => {
  document.title = `XGN BOT - Commands`;
  return (
    <div>
      <NavBar />
      <div
        className=""
        style={{
          textAlign: "left",
          margin: 55,
          color: "var(--text-color)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ color: "var(--main-color)", marginTop: 100 }}>
            <span style={{ fontFamily: "Alfa Slab One" }}>XGN BOT</span> <br />
            Commands
          </h1>
          <p>
            <b>Note: </b>all the commands are available in all servers, there's
            not and will never be a premium version for the bot.
            <br />
            We are working to make all the vanilla commands in slash commands.
            <br />
            <br />
            It's also possible that if you right click on a user in server it
            will appear an "Apps" section for application commands.
          </p>
        </div>
        <div className="row">
          <div className="col-sm-6">
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
              <h3 style={{ color: "var(--secondary-text-color)" }}>
                Fun Commands
              </h3>

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
                !fatc [animal] - send a random fact about an animal and a cute
                image
                <br />
                !tweet [message] - send a faked tweet image
              </p>
            </div>
            <div>
              <h3 style={{ color: "var(--secondary-text-color)" }}>
                Fun Images Commands
              </h3>
              <div>
                <p>
                  !gay [optional(member)] - creates an image with the
                  LGBTQI+XSXWWSD overlay
                  <br />
                  !wasted [optional(member)] - creates an image with the GTA
                  wasted overlay
                  <br />
                  !capture [optional(member)] - creates an image with a jail
                  <br />
                  !triggered [optional(member)] - creates a gif with the
                  triggered overlay
                </p>
              </div>
            </div>
            <div>
              <h3 style={{ color: "var(--secondary-text-color)" }}>
                Games Commands
              </h3>
              <div>
                <p>
                  !tictactoe [opponent] - creates an instance of a tic tac toe
                  game{" "}
                </p>
                <p>
                  !rps - creates a game of rock paper scissors(the opponent is
                  the computer)
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
                  !skipto|playindex [index] - go to a specific track in the
                  queue.
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
                !urban [query] - the bot sends the explanation of the word in
                the query (due to an api problem you need to use a NSFW channel
                to perform this command).
              </p>
            </div>
            <div>
              <h3 style={{ color: "var(--secondary-text-color)" }}>
                Meta/Info Commands
              </h3>
              <div>
                <p>
                  !info [optional(user)] : see the user info like join date in
                  server, the roles, the permissions, the ID, the rank, the xp,
                  and the level
                  <br />
                  !server : see the server info like the name, the image, the
                  number of members, the number of textual channels and the
                  vocal ones, you can see the also the most active member based
                  on the xp
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
          <div className="col-sm-5">
            <img
              src="/assets/help.png"
              alt=""
              className="img-container img-res"
            />
            <br />
            <p>
              This is the bot help menu, you can type{" "}
              <code>!help [module]</code> to see all the commands available in
              the module.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
