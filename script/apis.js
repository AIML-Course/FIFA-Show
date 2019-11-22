function organize(match) {
    var exactMatch = [];
    for(var i = 0; i < 3; i ++) {
        exactMatch.push({
            "Melon": match.team1.players[i].value,
            "Drupe": match.team2.players[i].value,
            "Pos": "Forward " + (i + 1)
        });
    }
    for(var i = 0; i < 5; i ++) {
        exactMatch.push({
            "Melon": match.team1.players[i + 3].value,
            "Drupe": match.team2.players[i + 3].value,
            "Pos": "Midfield " + (i + 1)
        });
    }
    for(var i = 0; i < 5; i ++) {
        exactMatch.push({
            "Melon": match.team1.players[i + 8].value,
            "Drupe": match.team2.players[i + 8].value,
            "Pos": "Fullback " + (i + 1)
        });
    }
    exactMatch.push({
        "Melon": match.team1.players[13].value,
        "Drupe": match.team2.players[13].value,
        "Pos": "Goalkeeper"
    });
    return exactMatch;
}
function formation(match) {
    document.getElementById("melonform").innerHTML = match.team1.formation;
    document.getElementById("drupeform").innerHTML = match.team2.formation;
}
function setResult(result) {
    document.getElementById("result").innerHTML =
        "Melon:" + result.t1Score + " Drupe:" + result.t2Score;
}
var match = null;
var req1 = new XMLHttpRequest();
req1.open('GET', 'https://kwtw3f5wyf.execute-api.ap-northeast-1.amazonaws.com/default/getMatchAttributes', true);
req1.onload = function() {
    if(this.status >= 200 && this.status < 400) {
        match = JSON.parse(this.response);
        var exactMatch = organize(match);
        formation(match);
        console.log(exactMatch);
        rander(null, exactMatch);
        console.log(match);
    } else {
        console.log("ERROR: Return");
    }
};
req1.onerror = function() {
    console.log("ERROR: Server Connection");
};
req1.send();

var req2 = new XMLHttpRequest();
req2.open('GET', 'https://em59r6sev4.execute-api.ap-northeast-1.amazonaws.com/default/getLeaderboard', true);
req2.onload = function() {
    console.log(this);
    if(this.status >= 200 && this.status < 400) {
        var leader = this.response;
        console.log(leader);
    } else {
        console.log("ERROR: Return");
    }
};
req2.onerror = function() {
    console.log("ERROR: Server Connection");
};
req2.send();

function checkMatch(name, select) {
    if(match == null) {
        console.log("ERROR: Not Ready");
    } else {
        var record = {
            "name": name,
            "select": select,
            "match": match
        };
        console.log(record);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://4nenoljj3j.execute-api.ap-northeast-1.amazonaws.com/default/getMatchResult", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(record));
        xhr.onload = function() {
            var result = JSON.parse(this.response);
            console.log(result);
            setResult(result);
        };
        xhr.onerror = function() {
            console.log("ERROR: Server Connection");
        };
    }
};
