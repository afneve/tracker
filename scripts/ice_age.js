"use strict";

var iceAge = {
    boardId: "9a32wh8V",
    listId: "",
    trelloCompleteArray: [],
    trelloPartialArray: [],

    /*
    ******************
    Start of App
    ******************
    */
    init: function () {
        iceAge.AuthenticateTrello();
    },
    AuthenticateTrello: function () {
        iceAge.usingTrelloData = false;
        if (typeof Trello != 'undefined') {
            Trello.authorize({
                name: "Tracking",
                type: "redirect",
                expiration: "never",
                persist: true,
                iteractive: true,
                return_url: "https://afneve.github.io/tracker/",
                callback_method: "fragment",
                key: "a4e071c48e784cee49ab732a869095d6",
                success: function () {
                    iceAge.usingTrelloData = true;
                    iceAge.updateLoggedIn();
                    var token = Trello.token();
                    iceAge.loadTrelloData();
                },
                error: function (e) {
                    alert("ERROR");
                    iceAge.usingTrelloData = false;
                    console.log(e);
                    iceAge.loadApp();
                },
                scope: {
                    read: true
                },
            });
        }
    },
    updateLoggedIn: function () {
        //Trello.unauthorize();
        var isLoggedIn = Trello.authorized();
        $("#loggedout").toggle(!isLoggedIn);
        $("#loggedin").toggle(isLoggedIn);
    },
    loadTrelloData: function () {
        Trello.get("/boards/" + iceAge.boardId + "/lists", function (cl) {
            for (var i = 0; i < cl.length; i++) {
                console.log(cl[i]);
            }

            /*
            Trello.get("lists/" + iceAge.listId + "/cards", function (cl) {
                for (var i = 0; i < cl.length; i++) {
                    console.log(cl[i]);
                }
            });*/ 
        });     

            
    },
    cleanTrelloData: function (currentListItem) {
        var tempArray = [],
            id = '',
            extra = '';

        tempArray = currentListItem.desc.split('|');
        id = tempArray[0];
        extra = tempArray[1];

        if (id !== "") {
            id = id.split(':')[1].trim();
        }

        if (extra !== "") {
            extra = extra.trim();
        }

        return {
            segmentId: id,
            extraInfo: extra
        }
    },
    loadApp: function () {
        var parameters = window.location.search;

        iceAge.dataCollection();
        iceAge.getIceAgeData();
        iceAge.displaySegmentList();
    }
};

iceAge.init();