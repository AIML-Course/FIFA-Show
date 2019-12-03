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
        "Match Result: Melon:" + result.t1Score + " Drupe:" + result.t2Score;
    document.getElementById("btnmelon").disabled = true;
    document.getElementById("btndrupe").disabled = true;
}
var match = null;
var req = new XMLHttpRequest();
req.open('GET', 'https://kwtw3f5wyf.execute-api.ap-northeast-1.amazonaws.com/default/getMatchAttributes', true);
req.onload = function() {
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
req.onerror = function() {
    console.log("ERROR: Server Connection");
};
req.send();

var reql = new XMLHttpRequest();
var leader = [];
reql.open('GET', 'https://em59r6sev4.execute-api.ap-northeast-1.amazonaws.com/default/getLeaderboard', true);
reql.onload = function() {
    console.log(this);
    if(this.status >= 200 && this.status < 400) {
        leader = this.response.split('\n').map(s => {
            var l = s.split(',');
            return {
                "name": l[0],
                "score": parseInt(l[1])
            };
        }).filter(o => !isNaN(o.score)).sort((a, b) =>
            b.score - a.score
        ).map(o => o.name + " : " + o.score);
        console.log(leader);
    } else {
        console.log("ERROR: Return");
    }
};
reql.onerror = function() {
    console.log("ERROR: Server Connection");
};
reql.send();

function checkMatchName(name, select) {
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
}
function checkMatch(select) {
    checkMatchName(document.getElementById("myText").value, select);
}
function checkLeader() {
    alert(leader.join("\n"));
}