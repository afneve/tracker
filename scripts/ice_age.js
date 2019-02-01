"use strict";

var iceAge = {
    boardId: "9a32wh8V",
    listId: "5c53b3dac4bbaa4552c4bcb9",
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
        var activityHTML = '';

        Trello.get("/boards/" + iceAge.boardId + "/lists", function (cl) {
            for (var i = 0; i < cl.length; i++) {
                console.log(cl[i]);
            }

            // Create a new JavaScript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds.
           

            
            Trello.get("lists/" + iceAge.listId + "/cards", function (cl) {
                var date = '';
                var time = '';

               

                for (var i = 0; i < cl.length; i++) {
                    console.log(cl[i]);

                    var dateTime = new Date(cl[i].dateLastActivity);
                    var date = dateTime.toDateString();
                    var time = dateTime.toLocaleTimeString();

                    activityHTML += '<div class="activity" style="margin-bottom: 20px">';
                    activityHTML += '<div class="date">' + date + '</div>';
                    activityHTML += '<div class="time">' + time + '</div>';
                    activityHTML += '<div class="name">' + cl[i].name + '</div>';
                    activityHTML += '</div>';
                }

                $('#app').html(activityHTML);
            });
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