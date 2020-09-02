const indexDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
let db;
const request = indexDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    var db = event.target.result;
    db.createObjectStore("name", { keyPath: "myKey" });
  };
request.onerror = function (event) {
    // Do something with request.errorCode!
    console.error("Database error: " + event.target.errorCode);
};
request.onsuccess = function (event) {
    // Do something with request.result!
    db = event.request.result;

    if(navigator.onLine){
        checkDatabase();
    }
};

function checkDatabase(){
    const transaction = db.transaction(["name"], "readwrite");
    const store = transaction.objectStore("name");
    const getAll = store.getAll();

    getAll.onsuccess = function (event) {
        // Do something with request.result!
        if(getAll.result.length > 0){
            fetch("/api/transction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json();
            }).then(() => {
                const transaction = db.transaction(["name"], "readwrite");
                const store = transaction.objectStore("name");
                store.clear();
            })
        }
    };
}


window.addEventListener("online", checkDatabase);