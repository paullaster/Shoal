import { computed } from 'vue'

export function useDiscountAnalytics(discounts) {
    const analytics = computed(() => {
        const total = discounts.value.length
        const published = discounts.value.filter(d => d.status === 'Published').length
        const unpublished = total - published
        const expiringSoon = discounts.value.filter(d => {
            const end = new Date(d.endPublishing)
            const now = new Date()
            return (end - now) / (1000 * 60 * 60 * 24) < 7 && end > now
        }).length
        return {
            total,
            published,
            unpublished,
            expiringSoon
        }
    })
    return { analytics }
}