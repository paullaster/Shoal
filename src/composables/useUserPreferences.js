import { ref, computed } from 'vue'

const preferences = ref({})

export function useUserPreferences(namespace) {
    const key = `user_prefs_${namespace}`
    preferences.value = JSON.parse(localStorage.getItem(key) || '{}')

    function setPreference(name, value) {
        preferences.value[name] = value
        localStorage.setItem(key, JSON.stringify(preferences.value))
    }

    return {
        preferences,
        setPreference
    }
}