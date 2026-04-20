const OBSWebSocket = require("obs-websocket-js").default;
const dotenv = require("dotenv");

dotenv.config();

const obs = new OBSWebSocket();

let intervalId = null;
let currentSettings = null;

//////////////////////
// API Call
//////////////////////

async function GetUpdatedStats(username) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const url = `https://api.chess.com/pub/player/${username}/games/${year}/${month}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.games || data.games.length === 0) return null;

    return data.games;
}

//////////////////////
// Formatting
//////////////////////

function FormatStats(allGames, settings) {
    let wins = 0;
    let draws = 0;
    let loses = 0;

    for (let i = 0; i < allGames.length; i++) {
        let game = allGames[i];

        if (game.time_class !== settings.timeControl) continue;
        if (game.rated !== true) continue;

        let result;
        if (game.white.username === settings.username) {
            result = game.white.result;
        } else {
            result = game.black.result;
        }

        let filtered = GetDetermination(result);

        if (filtered === "win") wins++;
        if (filtered === "lose") loses++;
        if (filtered === "draw") draws++;
    }

    return `${wins} Wins - ${draws} Draws - ${loses} Losses`;
}

function GetDetermination(result) {
    if (result === "win") return "win";

    if (
        result === "timeout" ||
        result === "resigned" ||
        result === "lose" ||
        result === "abandoned"
    ) {
        return "lose";
    }

    if (
        result === "insufficient" ||
        result === "drawn" ||
        result === "repetition" ||
        result === "agreement" ||
        result === "50move" ||
        result === "stalemate"
    ) {
        return "draw";
    }
}

//////////////////////
// OBS
//////////////////////

async function ConnectOBS() {
    await obs.connect(process.env.OBS_IP, process.env.OBS_PASSWORD);
    console.log("OBS connected");
}

async function UpdateOBS(text, settings) {
    await obs.call("SetInputSettings", {
        inputName: settings.obsLabel,
        inputSettings: { text },
        overlay: true,
    });
}

//////////////////////
// Public controls
//////////////////////

async function start(settings) {
    if (intervalId) {
        console.log("Already running");
        return;
    }

    currentSettings = settings;

    await ConnectOBS();

    intervalId = setInterval(async () => {
        try {
            const games = await GetUpdatedStats(settings.username);
            if (!games) return;

            const text = FormatStats(games, settings);

            console.log("Updating:", text);

            await UpdateOBS(text, settings);
        } catch (err) {
            console.error(err);
        }
    }, parseInt(settings.requestRate));
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("Stopped");
    }
}

module.exports = { start, stop };
