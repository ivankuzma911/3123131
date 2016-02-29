define(["../lib/mustache/mustache"], function(mustache) {
    return {
        settings: {

            messageArea: "messages",
            defaultNum: 5,
            moreButton: "more-button",
            username: "",
            sayButton: "say-button",
            message: "message",
            lastId:1,
            prevId:0,
        },



        init: function () {
            var s = this.settings;
            s.username = prompt("Your username");
            this.getMessages(s);
            this.bindEvents(s);


            var listenNew = function () {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                          var parent = document.getElementById(s.messageArea);
                         var json = JSON.parse(xhttp.responseText);
                           for (var i = 0; i < json.length; i++) {
                            var div = document.createElement('div');
                            var template = document.getElementById('template').innerHTML;
                            div.innerHTML = mustache.render(template, json[i]);
                            parent.insertBefore(div,parent.firstChild);
                            if(json[i].id > s.lastId){
                                s.lastId = json[i].id
                            }
                        }
                    }
                };

                xhttp.open("GET", "../core/request.php?action=getNewMessages&lastId="+ s.lastId, true);
                xhttp.send();
            };
           window.setInterval(listenNew, 1000);
        },

        newL:function (s) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var parent = document.getElementById(s.messageArea);
                    var json = JSON.parse(xhttp.responseText);
                    for (var i = 0; i < json.length; i++) {
                        var div = document.createElement('div');
                        var template = document.getElementById('template').innerHTML;
                        div.innerHTML = mustache.render(template, json[i]);
                        parent.insertBefore(div,parent.firstChild);
                        if(json[i].id > s.lastId){
                            s.lastId = json[i].id
                        }
                    }
                }
            };

            xhttp.open("GET", "../core/request.php?action=getNewMessages&lastId="+ s.lastId, true);
            xhttp.send();
        },




        bindEvents: function (s) {
            document.getElementById(s.sayButton).addEventListener('click', function () {
                var xhttp = new XMLHttpRequest();
                var text = document.getElementById(s.message).value;
                xhttp.open("GET", "../core/request.php?action=addNew&username=" + s.username + "&text=" + text, true);
                xhttp.send();
            });

            document.getElementById(s.moreButton).addEventListener('click', function () {
                var xhttp = new XMLHttpRequest();
                var parent = document.getElementById(s.messageArea);
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        var json = JSON.parse(xhttp.responseText);
                        for (var i = 0; i < json.length; i++) {
                            var div = document.createElement('div');
                            var template = document.getElementById('template').innerHTML;
                            div.innerHTML = mustache.render(template, json[i]);
                            parent.appendChild(div);
                            if(json[i].id < s.lastId){
                                s.prevId = json[i].id
                            }
                        }
                    }
                };

                xhttp.open("GET", "../core/request.php?action=getMoreMessages&prevId="+ s.prevId, true);
                xhttp.send();
            });
        },

        getMessages: function (s) {
            var xhttp = new XMLHttpRequest();
            var parent = document.getElementById(s.messageArea);
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var json = JSON.parse(xhttp.responseText);
                    for (var i = 0; i < json.length; i++) {
                        var div = document.createElement('div');
                        var template = document.getElementById('template').innerHTML;
                        div.innerHTML = mustache.render(document.getElementById('template'), json[i]);
                        parent.appendChild(div);
                        if(json[i].id > s.lastId){
                            s.lastId = json[i].id;
                        }
                        if(json[i].id < s.prevId || s.prevId == 0){
                            s.prevId = json[i].id;
                        }
                    }
                }

            };
            xhttp.open("GET", "../core/request.php?action=getMessages&num="+ s.defaultNum, true);
            xhttp.send();
        }
    };
});