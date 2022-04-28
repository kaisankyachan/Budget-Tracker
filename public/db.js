// sets up the db variable
let db;
// sets up a connection to the "budget" database
const request = indexedDB.open("budget", 1);
// sets up an object to store the pending inforemation
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};
// only read from db if it's online
request.onsuccess = function(event) {
  db = event.target.result;
  if (navigator.onLine) {
    checkDatabase();
  }
};
// log any errors to the console
request.onerror = function(event) {
  console.log("Error: " + event.target.errorCode);
};
// saves the record to either the db or the object
function saveRecord(record) {
  // set up a transaction for pending data
  const transaction = db.transaction(["pending"], "readwrite");
  // store the data in the object
  const store = transaction.objectStore("pending");
  // adds the record to the object
  store.add(record);
}
// checks to see if the database is online
function checkDatabase() {
  // set up a transaction for the pending data
  const transaction = db.transaction(["pending"], "readwrite");
  // store the data in the object
  const store = transaction.objectStore("pending");
  // gets any locally stored records and sets them up in a variable
  const getAll = store.getAll();
  // gets all of the transaction
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      // makes an HTTP request to the /api/transaction/bulk endpoint
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // sets up a transaction for the pending data
        const transaction = db.transaction(["pending"], "readwrite");
        // gets the locally stored records
        const store = transaction.objectStore("pending");
        // clears out all of the records in the object
        store.clear();
      });
    }
  };
}
// adds a listener to check if the database is online
window.addEventListener("online", checkDatabase);