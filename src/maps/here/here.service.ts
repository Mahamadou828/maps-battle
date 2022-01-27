import axios from "axios";
import { getCurrentUserPosition } from "../../utils/geolocalisation";
import { HereAddress, HereAutoComplete } from "./here.entity";

export async function autocomplete(label: string) {
  const { latitude, longitude } = await getCurrentUserPosition();
  const url = `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURI(
    label
  )}&at=${latitude},${longitude}&apikey=-QkCxWMoSOzAH8sNVs3RpUSNHyFjgfs7csw6zfrLySM&language=FR`;
  const response = await axios.get<HereAutoComplete>(url);
  return response.data;
}

export async function lookup(id: string) {
  const url = `https://lookup.search.hereapi.com/v1/lookup?id=${id}&apikey=-QkCxWMoSOzAH8sNVs3RpUSNHyFjgfs7csw6zfrLySM`;
  const response = await axios.get<HereAddress>(url);

  return response.data;
}
