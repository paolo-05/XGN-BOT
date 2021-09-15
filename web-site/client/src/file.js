import axios from "axios";
const accessToken = 'OU7kFm8xVV4bE38bA4pZceXIBvZsUS'
axios.get('https://xgnbot.xyz/api/users/me', {
    headers: {
        access_token: accessToken,
    }
}).then((resp) => {
    console.log(resp)
  })
