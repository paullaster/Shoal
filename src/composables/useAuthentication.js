import { useAuth } from "@/store"
export default () => {
    const authStore = useAuth();
    return {
        resendOtp: (payload) => authStore.resendOTP(payload),
    }
}