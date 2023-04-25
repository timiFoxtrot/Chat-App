const socket = io();

// socket.on("countUpdated", (count) => {
//   console.log("Count has been updated", count);
// });

// const button = document.querySelector("#increment");

// button.addEventListener("click", () => {
//   socket.emit("increment")
// })

// Elements
const form = document.querySelector("form");
const input = document.querySelector("input");
const formButton = form.querySelector("button");
const shareLocation = document.querySelector("#share-location");
const $messages = document.querySelector("#messages");

// Templates
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $locationTemplate =
  document.querySelector("#location-template").innerHTML;
const $sidebarTemplete = document.querySelector("#sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visible height
  const visibleHeight = $messages.offsetHeight

  // Height of messages container
  const containerHeight = $messages.scrollHeight

  // How far have I scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}
 
socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render($messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll()
});

socket.on("locationMessage", (location) => {
  console.log(location);
  const html = Mustache.render($locationTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoscroll()
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render($sidebarTemplete, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formButton.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", input.value, (error) => {
    formButton.removeAttribute("disabled");
    input.value = "";
    input.focus();
    if (error) {
      return alert(error);
    }

    console.log("Message delivered");
  });
});

shareLocation.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported on your browser");
  }

  shareLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const { latitude, longitude } = coords;
    socket.emit("sendLocation", { latitude, longitude }, () => {
      shareLocation.removeAttribute("disabled");
      console.log("Location shared");
    });
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
