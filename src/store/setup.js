import { defineStore } from "pinia";
import { _request } from "@/service";
import constnants from "./constants";

export const useSetupStore = defineStore('setup', {
    state(){
        return {
            categories: [
                {
                  cid: 'Cooked Meals',
                  description: ' Freshly Packaged Cooked Hot Meals',
                  createdAt: ' 2024-06-15 08:58:44',
                  updatedAt: ' 2024-06-15 09:25:08',
                  image: ' http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
                },
                {
                  cid: "Fried",
                  description: ' Fried Foods',
                  createdAt: ' 2024-06-15 11:34:18',
                  updatedAt: ' 2024-06-15 11:34:18',
                  image: ' http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
                },
                {
                  cid: 'Smoked',
                  description: ' Smoked Foods',
                  createdAt: ' 2024-06-15 08:58:24',
                  updatedAt: ' 2024-06-15 08:58:24',
                  image: ' http://192.168.0.103:3500/public/image/products/AAA084LGOVUAM.png'
                }
              ],
            currency: 'KSH.',
        }
    },
    getters: {
        setupGetter: (state) => (key) => state[key]
    },
    actions: {
        getCategories(){
            _request.axiosRequest({
                method: 'GET',
                url: constnants.categories,
            })
            .then((res) => {
                this.$patch({
                    categories: res.data.rows,
                });
            })
            .catch((err) => {
                this.toast.error(err.message);
            })
        }
    }
})