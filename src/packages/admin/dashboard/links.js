import AuthService from "@/packages/auth/AuthService";

export default [
    {
        path: `/admin/${btoa(AuthService.getUser().userId)}/dashboard`,
        order: 1,
        hasSubs: false,
        icon: "mdi-view-dashboard",
        title: "Dashboard",
        id: 'Admindashboard',
    },
    {
        path: `/admin/${btoa(AuthService.getUser().userId)}/users`,
        order: 3,
        hasSubs: false,
        icon: "mdi-account-group",
        title: "Manage Users",
        id: 'AdminManageUsers',
    },
    {
        path: `/admin/${btoa(AuthService.getUser().userId)}/products`,
        order: 2,
        hasSubs: true,
        icon: "mdi-shopping",
        title: "Manage Products",
        id: 'AdminManageProducts',
        subs: [
            {
                path: `/admin/${btoa(AuthService.getUser().userId)}/products`,
                order: 2,
                hasSubs: false,
                icon: "mdi-package-variant",
                title: "Products",
                id: 'AdminManageProductsProducts',
            },
            {
                path: `/admin/${btoa(AuthService.getUser().userId)}/discounts`,
                order: 2,
                hasSubs: false,
                icon: "mdi-percent-outline",
                title: "Discounts",
                id: 'AdminManageProductsDiscounts',
            }
        ],
    },
    {
        path: `/admin/${btoa(AuthService.getUser().userId)}/orders`,
        order: 4,
        hasSubs: false,
        icon: "mdi-cart-heart",
        title: "Manage Orders",
        id: 'AdminManageOrders',
    }
];