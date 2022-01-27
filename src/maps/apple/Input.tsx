import SearchIcon from "@mui/icons-material/Search";
import {
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React from "react";
import { ApplePlaces } from "./apple.entity";

interface Props {
  icon: React.ReactNode;
  placeholder: string;
  label: string;
  search: mapkit.Search;
  map: mapkit.Map;
}

export default function AppleTextField({
  icon,
  placeholder,
  label,
  search,
  map,
  ...props
}: Props) {
  const [value, setValue] = React.useState("");
  const [menuOptions, setMenuOptions] = React.useState<ApplePlaces[]>([]);
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
    enqueueSnackbar("Google cherche une address", {
      variant: "info",
    });
    search.search(value, (error, data) => {
      if (error) {
        console.log("Error", error);
        return;
      }

      const places = data.places;

      const markers: mapkit.MarkerAnnotation[] = [];

      places.forEach((place, index) => {
        const coord = new mapkit.Coordinate(
          place.coordinate.latitude,
          place.coordinate.longitude
        );
        const marker = new mapkit.MarkerAnnotation(coord, {
          title: place.formattedAddress,
          subtitle: place.name,
          displayPriority: index,
        });

        markers.push(marker);
      });

      map.addAnnotations(markers);

      setMenuOptions(data.places as unknown as ApplePlaces[]);
    });
  };

  return (
    <>
      <Paper
        component="div"
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
      {menuOptions.length > 0 ? (
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
              {menuOptions &&
                menuOptions.map((item, index: number) => (
                  <ListItem key={item.thoroughfare} sx={{ cursor: "pointer" }}>
                    {item.formattedAddress}
                  </ListItem>
                ))}
            </List>
          </Box>
        </Paper>
      ) : null}
    </>
  );
}
