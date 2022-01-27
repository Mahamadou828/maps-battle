function positionError(error: any) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error("User denied the request for Geolocation.");
      return "User denied the request for Geolocation.";

    case error.POSITION_UNAVAILABLE:
      console.error("Location information is unavailable.");
      return "Location information is unavailable.";

    case error.TIMEOUT:
      console.error("The request to get user location timed out.");
      return "The request to get user location timed out.";

    case error.UNKNOWN_ERROR:
      console.error("An unknown error occurred.");
      return "An unknown error occurred.";
  }
}

export function getCurrentUserPosition(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({
            latitude,
            longitude,
          });
        },
        (error) => {
          positionError(error);
          localStorage.setItem("geolocrejection", JSON.stringify(true));
          reject(null);
        }
      );
    }
  });
}
