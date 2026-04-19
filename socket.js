// TO DO //
// - Make dates more customizable

import OBSWebSocket from "obs-websocket-js";
import fetch from "node-fetch";
import dotenv from "dotenv";

///////////////
// Constants //
///////////////

// Connection Variables
dotenv.config();
const obs = new OBSWebSocket();

// This is where you control things, sorry not sorry.
const USERNAME = "itspumpk";
const TEXT_SOURCE = "stats";
const WAIT_TIME = 10000 * 1; // Time before API call again (5mins)
const TARGET_TIME_CONTROL = "blitz";

//////////////
// API Call //
//////////////

async function GetUpdatedStats() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const url = `https://api.chess.com/pub/player/${USERNAME}/games/${year}/${month}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.games || data.games.length === 0) return null;

    return data.games;
}

///////////////////////
// String Formatting //
///////////////////////

function FormatStats(allGames) {
    let wins = 0;
    let draws = 0;
    let loses = 0;
    for (let i = 0; i < allGames.length; i++) {
        let game = allGames[i];
        if (game.time_class != TARGET_TIME_CONTROL) continue;
        if (game.rated != true) continue;

        let result;
        if (game.white.username == USERNAME) {
            result = game.white.result;
        } else {
            result = game.black.result;
        }
        let filteredResult = GetDetermination(result);
        if (filteredResult == "win") wins++;
        if (filteredResult == "lose") loses++;
        if (filteredResult == "draw") draws++;
    }
    return `${wins} Wins - ${draws} Draws - ${loses} Losses`;
}

function GetDetermination(chessComResult) {
    if (chessComResult == "win") {
        return chessComResult;
    } else if (chessComResult == "timeout") {
        return "lose";
    } else if (chessComResult == "resigned") {
        return "lose";
    } else if (chessComResult == "lose") {
        return "lose";
    } else if (chessComResult == "abandoned") {
        return "lose";
    } else if (chessComResult == "insufficient") {
        return "draw";
    } else if (chessComResult == "drawn") {
        return "draw";
    } else if (chessComResult == "repetition") {
        return "draw";
    } else if (chessComResult == "agreement") {
        return "draw";
    } else if (chessComResult == "50move") {
        return "draw";
    } else if (chessComResult == "stalemate") {
        return "draw";
    }
}

//////////////////////
// Dealing With OBS //
//////////////////////

async function ConnectOBS() {
    await obs.connect(process.env.OBS_IP, process.env.OBS_PASSWORD);
    console.log("OBS Connection Validated");
}
async function UpdateOBS(text) {
    await obs.call("SetInputSettings", {
        inputName: TEXT_SOURCE,
        inputSettings: { text },
        overlay: true,
    });
}

//////////
// Main //
//////////

async function Run() {
    await ConnectOBS();
    setInterval(async () => {
        try {
            const games = await GetUpdatedStats();
            if (!games) return;

            const text = FormatStats(games);
            console.log("Updating:", text);

            await UpdateOBS(text);
        } catch (err) {
            console.error(err);
        }
    }, WAIT_TIME);
}

Run();
