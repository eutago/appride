const rideListElement = document.getElementById("rideList");
const allRides = getAllRides();

const getLocationData = async (latitude, longitude) => {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    const response = await fetch(url);
    return response.json();
};

const getMaxSpeed = (positions) => {
    const maxSpeed = 0;
    positions.forEach((position) => {
        if (position.speed != null && position.speed > maxSpeed) {
            maxSpeed = position.speed;
        }
    });

    return (maxSpeed * 3.6).toFixed(1);
};

const getDistance = (positions) => {
    const earthRadiusKm = 6371;
    let totalDistance = 0;

    const toRad = (degree) => {
        return (degree * Math.PI) / 180;
    };

    for (let i = 0; i < positions.length - 1; i++) {
        const p1 = {
            latitude: positions[i].latitude,
            longitude: positions[i].longitude,
        };
        const p2 = {
            latitude: positions[i + 1].latitude,
            longitude: positions[i + 1].longitude,
        };

        const deltaLatitude = toRad(p2.latitude - p1.latitude);
        const deltaLongitude = toRad(p2.longitude - p1.longitude);

        const a =
            Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
            Math.sin(deltaLongitude / 2) *
                Math.sin(deltaLongitude / 2) *
                Math.cos(toRad(p1.latitude) * Math.cos(toRad(p2.latitude)));

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = earthRadiusKm * c;

        totalDistance += distance;
    }

    return totalDistance.toFixed(2);
};

const getDuration = (ride) => {
    const format = (number, digits) => {
        return String(number.toFixed(0)).padStart(2, "0");
    };

    const interval = (ride.stopTime - ride.startTime) / 1000;

    const minutes = Math.trunc(interval / 60);
    const seconds = interval % 60;

    return `${format(minutes, 2)}:${format(seconds, 2)}`;
};

const getStartDate = (ride) => {
    const d = new Date(ride.startTime);

    const day = d.toLocaleString("pt-BR", { day: "numeric" });
    const month = d.toLocaleString("pt-BR", { month: "long" });
    const year = d.toLocaleString("pt-BR", { year: "numeric" });
    const hour = d.toLocaleString("pt-BR", { hour: "2-digit", hour12: false });
    const minute = d.toLocaleString("pt-BR", { minute: "2-digit" });

    return `${hour}:${minute} - ${month} ${day}, ${year}`;
};

allRides.forEach(async ([id, value]) => {
    const ride = JSON.parse(value);
    ride.id = id;

    const itemElement = document.createElement("li");
    itemElement.id = ride.id;
    itemElement.className = "d-flex p-1 align-items-center gap-3 shadow-sm ";

    rideListElement.appendChild(itemElement);

    const firstPosition = ride.data[0];
    const firstLocationData = await getLocationData(
        firstPosition.latitude,
        firstPosition.longitude,
    );

    const mapElement = document.createElement("div");
    mapElement.style = "width: 100px; height: 100px;";
    mapElement.className = "bg-secondary rounded-4";

    const dataElement = document.createElement("div");
    dataElement.className = "flex-fill d-flex flex-column";

    const cityDiv = document.createElement("div");
    cityDiv.innerHTML = `${firstLocationData.city} - ${firstLocationData.countryCode}`;
    cityDiv.className = "text-primary mb-2";

    const maxSpeedDiv = document.createElement("div");
    maxSpeedDiv.innerHTML = `Max speed: ${getMaxSpeed(ride.data)} Km/h`;
    maxSpeedDiv.className = "h5";

    const distanceDiv = document.createElement("div");
    distanceDiv.innerText = `Distance: ${getDistance(ride.data)} Km`;

    const durationDiv = document.createElement("div");
    durationDiv.innerText = `Duration: ${getDuration(ride)}`;

    const dateDiv = document.createElement("div");
    dateDiv.innerText = getStartDate(ride);
    dateDiv.className = "text-secondary mt-2";

    dataElement.appendChild(cityDiv);
    dataElement.appendChild(maxSpeedDiv);
    dataElement.appendChild(distanceDiv);
    dataElement.appendChild(durationDiv);
    dataElement.appendChild(dateDiv);

    itemElement.appendChild(mapElement);
    itemElement.appendChild(dataElement);
});
