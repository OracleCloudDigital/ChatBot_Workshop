function saveAppId(e) {
    e.preventDefault();
    console.log("initializing bots");
    let appId = document.getElementById("appId").value;
    window.localStorage.setItem("appId", appId);
    document.getElementById("loader").style.display = "block";

    let botsPromise = Bots.init({
        appId: appId
    });

    botsPromise.then(function (res){
        console.log("sucess");
        window.location.href = "home.html";
        document.getElementById("loader").style.display = "none";
    })
    .catch(function (err) {
        console.log(err);
        document.getElementById("loader").style.display = "none";            
        document.getElementsByClassName("error")[0].style.display = 'block';
    });
}
