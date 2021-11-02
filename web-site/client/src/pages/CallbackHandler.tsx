import React from "react";
import queryString from "query-string";
import { useEffect } from "react";
import axios from "axios";

import config from "../config.json";
import { NavBar } from "../components/NavBar";
import { Footer } from "../components/Footer";

interface TokenResponse {
  access_token: string | null;
}

export const CallbackHandler: React.FC = (props: any) => {
  const code = queryString.parse(props.location.search).code;
  useEffect(() => {
    axios.post(`${config.API_URL}/oauth/callback`, { code }).then((res) => {
      const data: TokenResponse = res.data;
      if (data.access_token === null) {
        window.location.href = "/login";
      } else {
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "/guilds";
      }
    });
  }, [code]);

  return (
    <div className="">
      <NavBar />
      <h1 style={{ margin: 300, textAlign: "center", fontSize: 60 }}>
        Redirecting...
      </h1>
      <Footer />
    </div>
  );
};
