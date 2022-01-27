import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Box } from "@mui/system";
import React, { Component } from "react";
import HereTextField from "./Input";

interface State {
  map: H.Map | null;
  showMap: boolean;
}

export class HereMaps extends Component<{}, State> {
  mapRef = React.createRef<HTMLDivElement>();

  private map: H.Map | null = null;
  private routingService: H.service.RoutingService | null = null;
  private platform: H.service.Platform | null = null;
  private group: H.map.Group = new H.map.Group();

  state = {
    map: null as H.Map | null,
    showMap: true,
  };

  addMarkToMap = (lat: number, lng: number) => {
    const marker = new H.map.Marker({ lat, lng });
    this.state.map?.addObject(marker);
  };

  calculateDistanceBetweenTwoPoint = (
    startLat: number,
    startLong: number,
    endLat: number,
    endLong: number
  ): Promise<{ distance: number; travelTime: number }> => {
    return new Promise((resolve, reject) => {
      if (this.routingService) {
        this.routingService.calculateRoute(
          {
            mode: "fastest;car;traffic:enabled",
            waypoint0: `${startLat},${startLong}`,
            waypoint1: `${endLat},${endLong}`,
            representation: "display",
            routeAttributes: "summary",
          },
          (data) => {
            if (data.response?.route && data.response?.route?.length > 0) {
              return resolve(data.response?.route[0].summary);
            }
            throw new Error(
              "Impossible de calculer la distance pour cette course"
            );
          },
          (error) => {
            resolve({
              distance: 0,
              travelTime: 0,
            });
          }
        );
      }
    });
  };

  centerMapView = (lat: number, lng: number) => {
    if (this.map) {
      this.map.removeObjects(this.map.getObjects());
      const marker = new H.map.Marker({ lat, lng });
      const group = new H.map.Group();
      group.addObject(marker);
      this.addMarkToMap(lat, lng);
      this.map?.setCenter({ lat, lng }, true);
      this.map?.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
        zoom: 15,
      });
    }
  };

  showMap = (showMap: boolean) => {
    return this.setState({
      showMap,
    });
  };

  traceRoute = (
    startLat: number,
    startLong: number,
    endLat: number,
    endLong: number
  ) => {
    if (this.routingService) {
      this.routingService.calculateRoute(
        {
          mode: "fastest;car;traffic:enabled",
          waypoint0: `${startLat},${startLong}`,
          waypoint1: `${endLat},${endLong}`,
          representation: "display",
          routeAttribute: "summary",
        },
        (data) => {
          if (data.response?.route && data.response?.route?.length > 0) {
            let lineString = new H.geo.LineString();
            data.response.route[0].shape.forEach((point) => {
              let [lat, lng] = point.split(",");
              lineString.pushPoint({ lat: +lat, lng: +lng });
            });
            let polyline = new H.map.Polyline(lineString, {
              style: {
                lineWidth: 5,
              },
            });

            if (this.map) {
              this.map.removeObjects(this.map.getObjects());
              this.group.addObject(polyline);
              this.map.addObject(this.group);
              this.map
                .getViewModel()
                .setLookAtData({ bounds: polyline.getBoundingBox() });
              this.addMarkToMap(startLat, startLong);
              this.addMarkToMap(endLat, endLong);
            }
          }
        },
        (error) => {
          return;
        }
      );
    }
  };

  clearMap = () => {
    this.group.removeAll();
  };

  componentDidMount() {
    const H = window.H;

    const apikey = "-QkCxWMoSOzAH8sNVs3RpUSNHyFjgfs7csw6zfrLySM";

    this.platform = new H.service.Platform({
      apikey,
    });

    this.routingService = this.platform.getRoutingService();

    const defaultLayers = this.platform.createDefaultLayers();

    if (this.mapRef.current) {
      //Create an instance of the map
      this.map = new H.Map(
        this.mapRef.current,
        defaultLayers.vector.normal.map,
        {
          // This map is centered over Europe
          center: { lat: 50, lng: 5 },
          zoom: 4,
          pixelRatio: window.devicePixelRatio || 1,
        }
      );

      // MapEvents enables the event system
      // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
      // This variable is unused and is present for explanatory purposes
      new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));

      // Create the default UI components to allow the user to interact with them
      // This variable is unused
      H.ui.UI.createDefault(this.map, defaultLayers);

      this.setState({ map: this.map });
    }
  }

  componentWillUnmount() {
    if (this.state.map)
      // Cleanup after the map to avoid memory leaks when this component exits the page
      this.state.map.dispose();
  }

  render() {
    return (
      <Box
        position="relative"
        display="flex"
        flexDirection="column"
        minHeight="100vh"
        width="100%"
      >
        <div ref={this.mapRef} style={{ height: "60vh", width: "100%" }} />

        <HereTextField
          placeholder="Une address"
          icon={<MyLocationIcon />}
          label="startAddress"
          map={this.state.map}
        />
      </Box>
    );
  }
}
