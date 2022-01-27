/* global mapkit */
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Box } from "@mui/system";
import { Component } from "react";
import { getCurrentUserPosition } from "../../utils/geolocalisation";
import AppleTextField from "./Input";

// const MAPS_KEY_ID = "S5F35MHKMV";
// const APPLE_TEAM_ID = "3H7P55KBRY";
// const APPLE_MAPS_KEY =
//   "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgCOWVTpiUgJ0fR70SSD7aDYfUIp5gEG07FIyfMca+J0mgCgYIKoZIzj0DAQehRANCAAQZqRJip88gV9SsEwVL3MecJ/3vWWLVugO1nId/jF3lucUo5BUpUeXYdQ9K4QUB5qjMqRMuk4ZitQX9Gsg9DaXL\n-----END PRIVATE KEY-----";
// const SITE_ORIGIN = "http://localhost:3000";

export class AppleMaps extends Component {
  state = {
    map: null,
    search: null,
  };

  async componentDidMount() {
    // const token = this.generateToken();
    const context = await getCurrentUserPosition();
    mapkit.init({
      authorizationCallback: function (done) {
        done(
          "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlM1RjM1TUhLTVYifQ.eyJvcmlnaW4iOiJodHRwczovL21hcHMtYmF0dGxlLnZlcmNlbC5hcHAvLGh0dHBzOi8vbWFwcy1iYXR0bGUudmVyY2VsLmFwcCIsImlhdCI6MTY0MjU5ODA0NiwiZXhwIjoxNjQyNjg0NDQ2LCJpc3MiOiIzSDdQNTVLQlJZIn0._k7wc3bL2kJnWAlB-gaU2v21_KkmzwmNtdXel8UIk7mDa6USSdrboTbR-ll8OVFZCh_jAgY2-zd5FiOiLeb8Vw"
        );
      },
    });

    const center = new mapkit.Coordinate(context.latitude, context.longitude);

    const map = new mapkit.Map("mapContainer", {
      center: new mapkit.Coordinate(context.latitude, context.longitude),
      showsZoomControl: true,
      isZoomEnabled: true,
      isScrollEnabled: true,
    });

    map.showsUserLocationControl = true;
    map.showsScale = mapkit.FeatureVisibility.Visible;
    map.setCenterAnimated(center, true);

    const search = new mapkit.Search({
      language: "fr",
      getsUserLocation: true,
      region: map.region,
    });

    this.setState({ map, search });
  }

  // generateToken() {
  //   const origin = SITE_ORIGIN;
  //   const privatekey = APPLE_MAPS_KEY.replace(/\\n/gm, "\n");
  //   const keyid = MAPS_KEY_ID;
  //   const issuer = APPLE_TEAM_ID;

  //   return jwt.sign(
  //     {
  //       origin,
  //     },
  //     privatekey,
  //     {
  //       algorithm: "ES256",
  //       expiresIn: "1d",
  //       keyid,
  //       issuer,
  //     }
  //   );
  // }

  render() {
    const { map, search } = this.state;
    return (
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        width="100%"
      >
        <div style={{ height: "60vh", width: "100%" }} id="mapContainer"></div>
        {map && search ? (
          <AppleTextField
            placeholder="Une address"
            icon={<MyLocationIcon />}
            label="startAddress"
            map={map}
            search={search}
          ></AppleTextField>
        ) : null}
      </Box>
    );
  }
}
