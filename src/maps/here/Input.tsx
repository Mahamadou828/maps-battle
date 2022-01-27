import RoomIcon from "@mui/icons-material/Room";
import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";
import { getCurrentUserPosition } from "../../utils/geolocalisation";
import { HereAutoComplete } from "./here.entity";
import { autocomplete } from "./here.service";

interface Props {
  icon: React.ReactNode;
  className?: string;
  placeholder: string;
  disabled?: boolean;
  label: string;
  defaultValue?: string;
  map: H.Map | null;
}

export interface HereAddress {
  title?: string;
  id?: string;
  resultType?: string;
  houseNumberType?: string;
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    stateCode: string;
    state: string;
    county: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
    houseNumber: string;
  };
  position: {
    lat: number;
    lng: number;
  };
  access?: [
    {
      lat: number;
      lng: number;
    }
  ];
  mapView?: {
    west: number;
    south: number;
    east: number;
    north: number;
  };
}

export default function HereTextField({
  className,
  placeholder,
  label,
  defaultValue,
  map,
  ...props
}: Props) {
  const [value, setValue] = React.useState(defaultValue || "");
  const [menuOptions, setMenuOptions] = React.useState<HereAutoComplete>({
    items: [],
  });
  const CancelToken = axios.CancelToken;
  const requestRef = CancelToken.source();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    requestRef.cancel();
    const value = e.target.value;
    setValue(value);
  };

  const sendRequest = async () => {
    enqueueSnackbar("Here cherche une address", {
      variant: "info",
    });
    if (!map) return;
    const res = await autocomplete(value);

    if (res.items.length === 0) {
      enqueueSnackbar("Pas d'address trouver pour here", {
        variant: "error",
      });
    }

    setMenuOptions(res);
  };

  React.useEffect(() => {
    if (defaultValue) setValue(defaultValue);
  }, [defaultValue]);

  const handleRecenter = async () => {
    const { latitude: lat, longitude: lng } = await getCurrentUserPosition();
    const markerInGroup = new H.map.Marker({ lat, lng });
    const group = new H.map.Group();
    group.addObject(markerInGroup);

    const marker = new H.map.Marker({ lat, lng });

    map?.setCenter({ lat, lng }, true);

    map?.addObject(marker);

    map?.getViewModel().setLookAtData({
      bounds: group.getBoundingBox(),
      zoom: 15,
    });
  };

  return (
    <>
      <Paper
        component="div"
        className={className}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "45%",
          position: "absolute",
          left: "50%",
          top: 5,
          transform: "translate(-50%, 0%)",
        }}
      >
        <Tooltip title="recentrer la vue">
          <IconButton
            onClick={handleRecenter}
            type="submit"
            sx={{ p: "10px" }}
            aria-label="search"
          >
            <RoomIcon />
          </IconButton>
        </Tooltip>

        <InputBase
          sx={{ ml: 1, flex: 1, fontSize: "1.1rem", position: "relative" }}
          placeholder={placeholder}
          inputProps={{ "aria-label": placeholder }}
          {...props}
          onChange={handleChange}
          value={value}
          inputRef={inputRef}
        />

        <InputAdornment position="end">
          <IconButton
            sx={{ paddingRight: "15px", paddingLeft: 0, zIndex: 100 }}
            edge="end"
            onClick={sendRequest}
          >
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      </Paper>
      {menuOptions.items.length > 0 ? (
        <Paper sx={{ py: "30px", mt: "30px" }}>
          <Typography
            sx={{
              textAlign: "start",
              paddingLeft: "15px",
            }}
            variant="h5"
          >
            Resultats:{" "}
          </Typography>
          <Box sx={{ bgcolor: "#fff" }}>
            <List>
              {menuOptions.items &&
                menuOptions.items.map((item, index: number) => (
                  <ListItem key={item.title} sx={{ cursor: "pointer" }}>
                    {item.title}
                  </ListItem>
                ))}
            </List>
          </Box>
        </Paper>
      ) : null}
    </>
  );
}
