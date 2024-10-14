import { defineStore } from "pinia";
import { useGlobalStore } from "./global";
import { _request } from "@/service";

export const useOrder = defineStore('order', {
    state: () => ({
        orders: [
            {
                orderId: 'ORD001',
                shippingRate: 150.50,
                paymentMethod: 'Mpesa',
                orderStatus: 'Pending Processing',
                originCart: 'Cart001',
                totalPrice: 1800.75,
                createAt: '2024-10-14',
                items: [
                  {
                    itemId: 'ITM001',
                    name: 'T-Shirt',
                    quantity: 2,
                    size: 'L',
                    color: 'Blue',
                    image: 'https://example.com/images/tshirt-blue.jpg',
                    price: 500.00,
                    totalPrice: 1000.00,
                    discount: 50.00,
                    productId: 'P001',
                  },
                  {
                    itemId: 'ITM002',
                    name: 'Sneakers',
                    quantity: 1,
                    size: '42',
                    color: 'White',
                    image: 'https://example.com/images/sneakers-white.jpg',
                    price: 800.00,
                    totalPrice: 800.00,
                    discount: 0.00,
                    productId: 'P002',
                  }
                ]
              },
              {
                orderId: 'ORD002',
                shippingRate: 120.00,
                paymentMethod: 'Cash On Delivery',
                orderStatus: 'New',
                originCart: 'Cart002',
                totalPrice: 2300.00,
                items: [
                  {
                    itemId: 'ITM003',
                    name: 'Jacket',
                    quantity: 1,
                    size: 'M',
                    color: 'Black',
                    image: 'https://example.com/images/jacket-black.jpg',
                    price: 2000.00,
                    totalPrice: 2000.00,
                    discount: 0.00,
                    productId: 'P003',
                  },
                  {
                    itemId: 'ITM004',
                    name: 'Hat',
                    quantity: 3,
                    size: 'One Size',
                    color: 'Red',
                    image: 'https://example.com/images/hat-red.jpg',
                    price: 100.00,
                    totalPrice: 300.00,
                    discount: 0.00,
                    productId: 'P004',
                  }
                ]
              },
              {
                orderId: 'ORD003',
                shippingRate: 90.00,
                paymentMethod: 'Bank Card',
                orderStatus: 'Processed',
                originCart: 'Cart003',
                totalPrice: 5000.00,
                items: [
                  {
                    itemId: 'ITM005',
                    name: 'Laptop',
                    quantity: 1,
                    size: '15 inch',
                    color: 'Gray',
                    image: 'https://example.com/images/laptop-gray.jpg',
                    price: 5000.00,
                    totalPrice: 5000.00,
                    discount: 0.00,
                    productId: 'P005',
                  }
                ]
              }
        ],
        orderItems: [
            {
                itemId: 'ITM001',
                name: 'T-Shirt',
                quantity: 2,
                size: 'L',
                color: 'Blue',
                image: 'https://picsum.photos/200/300',
                price: 500.00,
                totalPrice: 1000.00,
                discount: 50.00,
                productId: 'P001',
                orderId: 'ORD001',
            },
            {
                itemId: 'ITM002',
                name: 'Sneakers',
                quantity: 1,
                size: '42',
                color: 'White',
                image: 'https://picsum.photos/200/300?grayscale',
                price: 800.00,
                totalPrice: 800.00,
                discount: 100.00,
                productId: 'P002',
                orderId: 'ORD003',
            },
        ],
        orderListShowing: [],
        order:  {
            orderId: "ORD12345",
            shippingRate: 100.00,
            paymentMethod: "Mpesa",
            orderStatus: "Processed",
            originCart: "Cart001",
            totalPrice: 3000.00,
            items: [
              {
                itemId: "ITEM001",
                name: "T-shirt",
                quantity: 2,
                size: "M",
                color: "Blue",
                image: "https://picsum.photos/200/300/?blur=2",
                price: 500.00,
                totalPrice: 1000.00,
                discount: 50.00,
                productId: "PID123",
                orderId: "ORD12345"
              },
              {
                itemId: "ITEM002",
                name: "Jeans",
                quantity: 1,
                size: "L",
                color: "Black",
                image: "https://picsum.photos/seed/picsum/200/300",
                price: 1500.00,
                totalPrice: 1500.00,
                discount: 0.00,
                productId: "PID124",
                orderId: "ORD12345"
              }
            ]
          },
        orderNavigationTab: 1,
        loading: false,
        orderActions: [
            'view',
            'edit',
            'delete',
            'cancel',
            'reorder',
            'complete',
            'markAsShipped',
            'markAsDelivered',
        ],
    }),
    getters: {},
    actions: {
        setLoading(payload) {
            try {
                this.$patch({
                    loading: payload
                });
            } catch (error) {
                this.toast.error(error.message || "We experienced an error!");
            }
        },
        setGlobalLoading(payload) {
            try {
                useGlobalStore().setLoading(payload);
            } catch (error) {
                this.toast.error(error.message || "We experienced an error!");
            }
        },
        async fetchOrders(options = {}) {
            try {
                this.setGlobalLoading(true);
                this.setLoading(true);
                _request.axiosRequest({
                    url: 'orders',
                    method: 'GET',
                    params: options,
                })
                .then((orders) => {
                    this.$patch({ 
                        orders: orders.data.rows
                     });
                     this.setGlobalLoading(false);
                     this.setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    this.toast.error('Failed to fetch orders');
                    this.setGlobalLoading(false);
                    this.setLoading(false);
                })
            } catch (error) {
                console.error(error);
                this.toast.error('Failed to fetch orders');
            } finally {
                this.setLoading(false);
            }
        },
        async fetchOrder(orderId) {
            try {
                this.setLoading(true);
                this.setGlobalLoading(true);
                _request.axiosRequest({
                    url: `orders/${orderId}`,
                    method: 'GET',
                })
                .then((order) => {
                    this.$patch({ 
                        order: order.data
                     });
                     this.setGlobalLoading(false);
                     this.setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    this.toast.error('Failed to fetch order');
                    this.setGlobalLoading(false);
                    this.setLoading(false);
                })
            } catch (error) {
                console.error(error);
                this.toast.error('Failed to fetch order');
            } 
        },
        getItemOrder(orderId) {
            try {
                return this.orders.find((order) => order.orderId === orderId)
            } catch (error) {
                console.error(error);
                this.toast.error('Error')
            }
        },
        async switchOrderTabData (tab) {
            try {
                switch(tab) {
                    case 1:
                        await this.fetchOrders({status: 'ne-Cancelled'});
                        break;
                    case 2:
                        await this.fetchOrders({status: 'Cancelled'});
                        break;
                    default:
                        await this.fetchOrder({status: 'ne-Cancelled'});
                        break;
                }
            } catch (error) {
                console.error(error);
                this.toast.error('Error')
            }
        }
    }
});