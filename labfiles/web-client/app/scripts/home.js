 function saveAppId(e) {
            e.preventDefault();
            console.log("init smooch")
            let appId = window.localStorage.getItem("appId");
            let botsPromise = Bots.init({          
                appId: appId
            });

            botsPromise.then(function() {
                console.log("init complete");
                document.getElementById("loader").style.display = "none";
                Bots.open();
                document.getElementById("openChatButton").setAttribute("disabled", true)   
            })
            .catch(function (err) {
                console.log(err);
            });
        }