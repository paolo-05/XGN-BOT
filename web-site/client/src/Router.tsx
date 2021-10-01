import React from "react";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import { CallbackHandler } from "./pages/CallbackHandler";
import { Homepage } from "./pages/Homepage";
import { Commands } from "./pages/Commands";
import { Login } from "./pages/Login";
import { Logout } from "./pages/Logout";
import { ShowGuilds } from "./pages/ShowGuilds";
import { Home } from "./pages/guild/Home";
import { Welcome } from "./pages/guild/Welcome";
import { Leave } from "./pages/guild/Leave";
import { Leveling } from "./pages/guild/Leveling";
import { Logging } from "./pages/guild/Logging";
import { Settings } from "./pages/guild/Settings";
import { Leaderboard } from "./pages/guild/Leaderboard";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <Route exact path="/commands" component={Commands} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/callback" component={CallbackHandler} />
        <Route exact path="/guilds" component={ShowGuilds} />
        <Route exact path="/guilds/home/:id/" key="guild" component={Home} />
        <Route
          exact
          path="/guilds/welcome/:id/"
          key="guild"
          component={Welcome}
        />
        <Route exact path="/guilds/leave/:id/" key="guild" component={Leave} />
        <Route
          exact
          path="/guilds/leveling/:id/"
          key="guild"
          component={Leveling}
        />
        <Route
          exact
          path="/guilds/logging/:id/"
          key="guild"
          component={Logging}
        />
        <Route
          exact
          path="/guilds/settings/:id/"
          key="guild"
          component={Settings}
        />
        <Route
          exact
          path="/leaderboard/:id/"
          key="guild"
          component={Leaderboard}
        />
        <Route exact path="*">
          <NoMatch />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
function NoMatch() {
  let location = useLocation();

  return (
    <div>
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
            <a
              className="navbar-brand"
              href={"/"}
              style={{
                color: "var(--main-color)",
                fontFamily: "Alfa Slab One",
              }}
            >
              XGN BOT
            </a>
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
                  <a
                    className="nav-link active smoothScroll"
                    href="#feature"
                    style={{ color: "var(--text-color)" }}
                  >
                    See Features
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link smoothScroll"
                    href="#commands"
                    style={{ color: "var(--text-color)" }}
                  >
                    Commands
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link smoothScroll"
                    onClick={() => {
                      window.open(
                        "https://cutt.ly/XGNbot",
                        "Invite",
                        "width=450,height=750"
                      );
                    }}
                    style={{ color: "var(--text-color)" }}
                    href={"/"}
                  >
                    Invite
                  </a>
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
      <header
        className="d-xl-flex flex-column justify-content-xl-center align-items-xl-center"
        style={{ textAlign: "center", marginTop: 150 }}
      >
        <h1
          className="d-xl-flex justify-content-xl-start"
          style={{ color: "var(--text-color)", fontSize: 150 }}
        >
          404
        </h1>
        <h1
          className="d-xl-flex justify-content-xl-start"
          style={{ color: "var(--text-color)", fontSize: 100 }}
        >
          Page not found
        </h1>
        <p style={{ color: "var(--secondary-text-color)" }}>
          No match for <code>{location.pathname}</code>
        </p>
      </header>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="var(--secondary)"
          fill-opacity="1"
          d="M0,160L48,154.7C96,149,192,139,288,154.7C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,192C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <div
        className="footer-dark"
        style={{
          background: "var(--secondary)",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col item social">
              <a className="smoothScroll" href="#top">
                <i className="icon ion-android-arrow-up"></i>
              </a>
            </div>
          </div>
          <p className="copyright" style={{ color: "var(--text-color)" }}>
            XGN BOT © 2021
          </p>
          <p
            className="copyright"
            style={{ color: "var(--text-color)", padding: 0 }}
          >
            Need help?&nbsp;
            <a style={{ color: "#bbb" }} href="https://discord.gg/8V62RTS25Q">
              Support Guild
            </a>
          </p>
          <p
            className="copyright"
            style={{ color: "var(--text-color)", padding: 0 }}
          >
            made with <i className="bx bxs-heart"></i>, React and python. <br />
            Not affiliated with discord.com <br />
            <a style={{ color: "var(--text-color)" }} href="/privacy">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
