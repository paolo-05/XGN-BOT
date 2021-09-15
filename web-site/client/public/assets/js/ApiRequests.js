const changePrefix = () => {
    const url = "/api/change_prefix";
    const guildID = window.location.pathname.replace("/guild/", "");
    const prefix = document.getElementById('prefix').value;
    if (!prefix) {
        window.alert("The prefix must be at least one character long")
        return;
    }

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'prefix': prefix
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload()
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//ENABLE THE WELCOME EVENT
const enableWelcome = () => {
    const url = "/api/enablewelcome";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//ENABLE THE WELCOME EVENT
const disableWelcome = () => {
    const url = "/api/disable";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'action': 'welcome'
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//MODIFY THE WELCOME EVENT (ONLY IF IS ENABLED)
const changeWelcome = () => {
    const url = "/api/changewelcome";
    const guildID = window.location.pathname.replace("/guild/", "");

    const message = document.getElementById('welcome-message').value;
    if (!message) {
        window.alert("Please fill all the fields")
        return;
    }
    const channel_selction = document.getElementById('welcome-channel');
    const channel_id = channel_selction.options[channel_selction.selectedIndex].value;
    if (!channel_id) {
        window.alert("Please fill all the fields")
        return;
    }
    console.log(guildID)
    console.log(message);
    console.log(channel_id);

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'message': message,
            'channel_id': channel_id,
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//ENABLE THE LEAVE EVENT
const enableLeave = () => {
    const url = "/api/enableleave";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//ENABLE THE WELCOME EVENT
const disableLeave = () => {
    const url = "/api/disable";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'action': 'leave'
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//MODIFY THE LEAVE EVENT (ONLY IF IS ENABLED)
const changeLeave = () => {
    const url = "/api/changeleave";
    const guildID = window.location.pathname.replace("/guild/", "");

    const message = document.getElementById('leave-message').value;
    if (!message) {
        window.alert("Please fill all the fields")
        return;
    }
    const channel_selction = document.getElementById('leave-channel');
    const channel_id = channel_selction.options[channel_selction.selectedIndex].value;
    if (!channel_id) {
        window.alert("Please fill all the fields")
        return;
    }
    console.log(guildID)
    console.log(message);
    console.log(channel_id);

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'message': message,
            'channel_id': channel_id,
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//ENABLE THE LEVELLING SYSTEM
const enableLevels = () => {
    const url = "/api/enableleveling";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
const disableLevels = () => {
    const url = "/api/disable";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'action': 'levelling'
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
//MODIFY THE LEVELLING SYSTEM (ONLY IF IS ENABLED)
const changeLevels = () => {
    const url = "/api/changeleveling";
    const guildID = window.location.pathname.replace("/guild/", "");

    const message = document.getElementById('level-message').value;
    if (!message) {
        window.alert("Please fill all the fields")
        return;
    }
    const channel_selction = document.getElementById('level-channel');
    const channel_id = channel_selction.options[channel_selction.selectedIndex].value;
    if (!channel_id) {
        window.alert("Please fill all the fields")
        return;
    }
    console.log(guildID)
    console.log(message);
    console.log(channel_id);

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'message': message,
            'channel_id': channel_id,
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}

const enableLog = () => {
    const url = "/api/enablelog";
    const guildID = window.location.pathname.replace("/guild/", "");


    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
const disableLog = () => {
    const url = "/api/disable";
    const guildID = window.location.pathname.replace("/guild/", "");

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'action': 'log'
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
const changeLog = () => {
    const url = "/api/changelog";
    const guildID = window.location.pathname.replace("/guild/", "");

    const channel_selction = document.getElementById('log-channel');
    const channel_id = channel_selction.options[channel_selction.selectedIndex].value;
    if (!channel_id) {
        window.alert("Please fill all the fields")
        return;
    }
    console.log(guildID)
    console.log(channel_id);

    fetch(url, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'guild_id': guildID,
            'channel_id': channel_id,
        })
    })
        .then(response => response.json())
        .then(resp => {
            if (resp.status == 200) {
                location.reload();
                console.log('okk')
            }
            else {
                console.log("Something went wrong")
            }
        });
}
