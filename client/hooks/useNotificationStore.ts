import { useNotificationStore } from "@/store/notification.store";

export function useNotification(){
    return useNotificationStore();
}