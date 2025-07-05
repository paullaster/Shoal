import { discount } from "@/store/discount";
import { storeToRefs } from "pinia";

export const useDiscount = () => {
    const discountStore = discount();
    const { discountsGetter, sortByGetter, totalDiscountsGetter, filterStatus, page, pageSize, search, getDialog } = storeToRefs(discountStore);

    return {
        filterStatus,
        page,
        pageSize,
        discounts: discountsGetter,
        search,
        sortBy: sortByGetter,
        totalDiscounts: totalDiscountsGetter,
        dialog: getDialog,
        createDiscount: async (payload) => await discountStore.createDiscount(payload),
        fetchDiscounts: async () => await discountStore.fetchDiscounts(),
        setFilterStatus: (payload) => discountStore.setFilterStatus(payload),
        setSortBy: (payload) => discountStore.setSortBy(payload),
        setDialog: (payload) => discountStore.setDialog(payload),
    };
}