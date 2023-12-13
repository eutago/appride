const speedElement = document.getElementById("speed");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");

let watchID = null;
let currentRide = null;
startBtn.addEventListener("click", () => {
    if (watchID) return;

    const handleSuccess = (position) => {
        addPosition(currentRide, position);
        console.log(position);
        speedElement.innerHTML = position.coords.speed
            ? (position.coords.speed * 3.6).toFixed(1)
            : 0;
    };

    const handleError = (error) => {
        console.log(error);
    };
    const options = { enableHighAccuracy: true };
    currentRide = createNewRide();
    watchID = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        options,
    );
    startBtn.classList.add("d-none");
    stopBtn.classList.remove("d-none");
});

stopBtn.addEventListener("click", () => {
    if (!watchID) return;

    navigator.geolocation.clearWatch(watchID);
    watchID = null;
    updateStopTime(currentRide);
    currentRide = null;
    startBtn.classList.remove("d-none");
    stopBtn.classList.add("d-none");
});
