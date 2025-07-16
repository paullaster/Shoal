export default {
    products: 'v1/products',
    v2products: 'v2/products',
    categories: 'v1/categories',
    cart: 'v1/cart',
    login: 'v1/auth/login',
    register: 'v1/auth/register',
    logout: 'v1/auth/logout',
    images: 'v1/assets/image',
    setup: (setupUrl) => {
        return `v1/setups/${setupUrl}`;
    },
    discount: 'v1/discounts',
    attribute: 'v1/attribute',
}