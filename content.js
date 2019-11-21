var match = null;
var req1 = new XMLHttpRequest();
req1.open('GET', 'https://kwtw3f5wyf.execute-api.ap-northeast-1.amazonaws.com/default/getMatchAttributes', true);
req1.onload = function() {
    if(this.status >= 200 && this.status < 400) {
        match = JSON.parse(this.response);
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
            console.log(this.response);
        };
        xhr.onerror = function() {
            console.log("ERROR: Server Connection");
        };
    }
};
