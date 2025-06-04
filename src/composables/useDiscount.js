import { discount } from "@/store/discount";
import { storeToRefs } from "pinia";

export const useDiscount = () => {
    const discountStore = discount();
    const { discountGetters, filterStatus, page, pageSize, search, } = storeToRefs(discountStore);

    return {
        filterStatus,
        page,
        pageSize,
        discounts: discountGetters('discounts'),
        search,
        sortBy: discountGetters('sortBy'),
        totalDiscounts: discountGetters('totalDiscounts'),
        createDiscount: async (payload) => await discountStore.createDiscount(payload),
        fetchDiscounts: async () => await discountStore.fetchDiscounts(),
    };
}