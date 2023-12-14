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
    for (let i = 0; i < positions.length - 1; i++) {
        const p1 = {
            latitude: positions[i].latitude,
            longitude: positions[i].longitude,
        };
        const p2 = {
            latitude: positions[i + 1].latitude,
            longitude: positions[i + 1].longitude,
        };
    }
};

allRides.forEach(async ([id, value]) => {
    const ride = JSON.parse(value);
    ride.id = id;

    const firstPosition = ride.data[0];
    const firstLocationData = await getLocationData(
        firstPosition.latitude,
        firstPosition.longitude,
    );

    const itemElement = document.createElement("li");
    itemElement.id = ride.id;

    const cityDiv = document.createElement("div");
    cityDiv.innerHTML = `${firstLocationData.city} - ${firstLocationData.countryCode}`;

    const maxSpeedDiv = document.createElement("div");
    maxSpeedDiv.innerHTML = getMaxSpeed(ride.data);

    itemElement.appendChild(cityDiv);
    itemElement.appendChild(maxSpeedDiv);
    rideListElement.appendChild(itemElement);
});
