import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CallbackHandler } from "./pages/CallbackHandler";
import { Homepage } from "./pages/Homepage";
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
                <Route exact path="/" component={Homepage}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/logout" component={Logout}/>
                <Route exact path="/callback" component={CallbackHandler}/>
                <Route exact path="/guilds" component={ShowGuilds}/>
                <Route exact path='/guilds/home/:id/' key="guild" component={Home}/>
                <Route exact path='/guilds/welcome/:id/' key="guild" component={Welcome}/>
                <Route exact path='/guilds/leave/:id/' key="guild" component={Leave}/>
                <Route exact path='/guilds/leveling/:id/' key="guild" component={Leveling}/>
                <Route exact path='/guilds/logging/:id/' key="guild" component={Logging}/>
                <Route exact path='/guilds/settings/:id/' key="guild" component={Settings}/>
                <Route exact path='/leaderboard/:id/' key="guild" component={Leaderboard}/>
            </Switch>
        </BrowserRouter>
    )
}