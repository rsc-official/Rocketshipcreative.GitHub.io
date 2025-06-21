// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBfKcvfsiA7qkYVXvWDAz7Vti2eDjujVZg",
  authDomain: "rocketshipcreative.firebaseapp.com",
  databaseURL: "https://rocketshipcreative-default-rtdb.firebaseio.com", 
  projectId: "rocketshipcreative",
  storageBucket: "rocketshipcreative.appspot.com",
  messagingSenderId: "1037207022274",
  appId: "1:1037207022274:web:3a6f1d7d8c6d0d1e1d6d7c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

// Load Messages
db.ref("messages").on("value", snapshot => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";
  snapshot.forEach(child => {
    const msg = child.val();
    const div = document.createElement("div");
    div.className = "message";
    if (msg.text) {
      div.textContent = `${msg.user}: ${msg.text}`;
    } else if (msg.mediaUrl) {
      const media = document.createElement(msg.mediaUrl.endsWith(".mp4") ? "video" : "img");
      media.src = msg.mediaUrl;
      media.width = 300;
      media.controls = msg.mediaUrl.endsWith(".mp4");
      div.appendChild(media);
    }
    chatBox.appendChild(div);
  });
});

function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (text !== "") {
    db.ref("messages").push({
      user: "Visitor",
      text: text,
      timestamp: Date.now()
    });
    input.value = "";
  }
}

function uploadMedia() {
  const fileInput = document.getElementById("media-upload");
  const file = fileInput.files[0];
  if (!file) return;

  const fileName = Date.now() + "-" + file.name;
  const uploadTask = storage.ref("media/" + fileName).put(file);

  uploadTask.on("state_changed", null, error => {
    console.error("Upload failed:", error);
  }, () => {
    uploadTask.snapshot.ref.getDownloadURL().then(url => {
      db.ref("messages").push({
        user: "Visitor",
        mediaUrl: url,
        timestamp: Date.now()
      });
    });
  });
}
