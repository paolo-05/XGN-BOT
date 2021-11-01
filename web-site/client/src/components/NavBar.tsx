import React, { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../types";
import { NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import config from "../config.json";

export const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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
        });
    }
  }, [accessToken]);

  return (
    <div id="top" style={{ height: 12, background: "var(--background)" }}>
      <nav
        className="navbar navbar-dark navbar-expand fixed-top"
        style={{
          color: "var(--main-color)",
          borderTopWidth: 6,
          borderTopStyle: "solid",
          borderColor: "var(--main-color)",
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
            <img
              className="d-inline-block align-text-top"
              src="/logo.svg"
              width="30"
              height="30"
              style={{ borderRadius: "50%" }}
              alt=""
            />{" "}
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
                <a
                  className="nav-link active smoothScroll"
                  href="/#feature"
                  style={{ color: "var(--text-color)" }}
                >
                  See Features
                </a>
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
                <a
                  className="nav-link smoothScroll"
                  href="https://discord.gg/8V62RTS25Q"
                  style={{ color: "var(--text-color)" }}
                >
                  Support Guild
                </a>
              </li>

              {!accessToken ? (
                <li className="nav-item">
                  <NavLink
                    className="nav-link smoothScroll"
                    to="/login"
                    style={{ color: "var(--text-color)" }}
                  >
                    Login
                  </NavLink>
                </li>
              ) : (
                <>
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
                            className="nav-link"
                          >
                            My servers
                          </NavLink>
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <NavLink
                            to="/logout"
                            style={{
                              color: "#ff0000",
                            }}
                            className="nav-link"
                          >
                            Logout
                          </NavLink>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};
