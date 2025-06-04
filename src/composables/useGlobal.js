import { useGlobalStore } from "@/store";
import { icons } from "@/util/IconProvider";
import { storeToRefs } from "pinia";

export default () => {
    const iconOptions = icons();
    const globalStore = useGlobalStore();
    const { globalGetter } = storeToRefs(globalStore);

    return {
        loading: globalGetter.value('loading'),
        iconOptions,
    }
}