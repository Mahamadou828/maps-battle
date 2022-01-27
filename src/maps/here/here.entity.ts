export interface HereAddress {
    title: string;
    id: string;
    resultType: string;
    localityType: string;
    address: Address;
    position: Position;
    mapView: MapView;
  }
  
  interface Address {
    label: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    state: string;
    county: string;
    city: string;
    postalCode: string;
  }
  
  interface Position {
    lat: number;
    lng: number;
  }
  
  interface MapView {
    west: number;
    south: number;
    east: number;
    north: number;
  }
  
  export interface HereAutoComplete {
    items: Item[];
  }
  
  interface Item {
    id: string;
    title: string;
  }
  