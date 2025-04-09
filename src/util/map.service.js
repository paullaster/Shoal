import { _request } from "@/service";
import { useToast } from "vue-toastification";

class MapServices {
    async reverseGeocoding (long, lat, options) {
        try {
            return await _request.axiosRequest({
                url: "maps/reverse-geocode",
                method: "GET",
                params: {
                    longitude: long,
                    latitude: lat,
                   ...options,
                }
            })
        } catch (error) {
            return useToast().error(error.message || "Error while reverse geocoding");
        }
    }
}

export default new MapServices();