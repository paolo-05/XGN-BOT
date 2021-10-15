import React from "react";
import { NavLink } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
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
          Made by paolo#5731 with{" "}
          <i className="bx bxs-heart" style={{ color: "#ff0000" }}></i>
          <br />
          Not affiliated with discord.com <br />
          <NavLink style={{ color: "var(--text-color)" }} to="/privacy">
            Privacy Policy
          </NavLink>
        </p>
      </div>
    </div>
  );
};
