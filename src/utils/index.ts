import { toast } from "react-toastify";

export const checkError = (
  message: any,
  isCatchError: boolean = false,
  isToast: boolean = true
) => {
  if (message.verifyError) {
    isToast &&
      createNotification(
        "error",
        "Signature Error!, please try to sign again!"
      );
    throw new Error(message.verifyError);
  }
  if (typeof message !== "string") return false;
  if (isCatchError && message.startsWith("Network"))
    isToast &&
      createNotification("warning", "Server error, please try again later!");
  if (message.startsWith("Request")) {
    isToast &&
      createNotification("warning", "Server error, please try again later!");
    if (!isCatchError) throw new Error(message);
  }
  if (message.startsWith("TestScript")) {
    isToast &&
      createNotification(
        "warning",
        "Test Script has not been generated yet., please try again later!"
      );
    if (!isCatchError) throw new Error(message);
  }
  if (
    message === "You must subscribe tokens!" ||
    message === "Not enough tokens!" ||
    message === "Subscribe already finished!"
  ) {
    isToast && createNotification("warning", message);
    throw new Error(message);
  }
  return false;
};

export const requestNotificationPermission = async () => {
  if (Notification.permission !== "granted")
    await Notification.requestPermission();
};

export const showNotification = (title: string, message?: string) => {
  if (Notification.permission === "granted") {
    let notification = new Notification(title, {
      body: message,
      icon: "/images/notification-icon.png",
    });

    notification.onclick = () => {
      window.focus();
    };
  }
};

export const createNotification = (type: string, message: string) => {
  switch (type) {
    case "info":
      toast.info(message);
      break;
    case "success":
      toast.success(message);
      break;
    case "warning":
      toast.warn(message);
      break;
    case "error":
      toast.error(message);
      break;
    default:
      toast.info(message);
      break;
  }
};

export const copyToClipboard = (
  text: string,
  setIsCopid: any,
  message?: string
) => {
  try {
    if (!navigator.clipboard) {
      createNotification(
        "error",
        "Clipboard access is not supported in this browser!"
      );
      return;
    }
    navigator.clipboard.writeText(text);
    setIsCopid(true);
    setTimeout(() => {
      setIsCopid(false);
    }, 5000);
    message && createNotification("success", message);
  } catch (error) {
    createNotification("error", "Failed to copy text to clipboard!");
    return;
  }
};
