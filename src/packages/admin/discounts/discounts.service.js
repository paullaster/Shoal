import axios from 'axios'

const API_BASE = '/api/admin/discounts'

export async function fetchDiscounts() {
    return axios.get(API_BASE)
}

export async function createDiscount(data) {
    return axios.post(API_BASE, data)
}

export async function updateDiscount(id, data) {
    return axios.put(`${API_BASE}/${id}`, data)
}

export async function deleteDiscount(id) {
    return axios.delete(`${API_BASE}/${id}`)
}

export async function fetchDiscountDetails(id) {
    return axios.get(`${API_BASE}/${id}`)
}

export async function fetchDiscountProducts(id) {
    return axios.get(`${API_BASE}/${id}/products`)
}