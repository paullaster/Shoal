import { ref } from 'vue'

export function useTheme() {
    const theme = ref(localStorage.getItem('theme') || 'light')
    function toggleTheme() {
        theme.value = theme.value === 'light' ? 'dark' : 'light'
        localStorage.setItem('theme', theme.value)
        document.documentElement.setAttribute('data-theme', theme.value)
    }
    return { theme, toggleTheme }
}