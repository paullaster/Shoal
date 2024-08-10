import AuthService from "@/packages/auth/AuthService";

export default [
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/dashboard`,
        order: 1,
        hasSubs: false,
        icon: "mdi-view-dashboard",
        title: "Dashboard",
        id: 'Admindashboard',
    },
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/users`,
        order: 3,
        hasSubs: false,
        icon: "mdi-account-group",
        title: "Manage Users",
        id: 'AdminManageUsers',
    },
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/products`,
        order: 2,
        hasSubs: false,
        icon: "mdi-shopping",
        title: "Manage Products",
        id: 'AdminManageProducts',
    },
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/orders`,
        order: 4,
        hasSubs: false,
        icon: "mdi-cart-heart",
        title: "Manage Orders",
        id: 'AdminManageOrders',
    }
];