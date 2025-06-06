export default {
    products: 'products',
    categories: 'categories',
    cart: 'cart',
    login: 'auth/login',
    register: 'auth/register',
    logout: 'auth/logout',
    images: 'assets/image',
    setup: (setupUrl) => {
        return `setups/${setupUrl}`;
    },
    discount: 'discounts',
    attribute: 'attribute',
}