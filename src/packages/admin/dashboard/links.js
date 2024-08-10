import AuthService from "@/packages/auth/AuthService";

export default [
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/dashboard`,
        order: 1,
        hasSubs: false,
        icon: "mdi-view-dashboard",
        title: "Dashboard",
    },
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/users`,
        order: 3,
        hasSubs: false,
        icon: "mdi-account-group",
        title: "Manage Users",
    },
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/products`,
        order: 2,
        hasSubs: false,
        icon: "mdi-shopping",
        title: "Manage Products",
    },
    {
        path: `/admin/${btoa(AuthService.getUser().id)}/orders`,
        order: 4,
        hasSubs: false,
        icon: "mdi-cart-heart",
        title: "Manage Orders",
    }
];