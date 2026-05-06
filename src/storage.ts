const KEY = "duel-golf-app-v2";

export function loadAppState(defaultState: any) {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function saveAppState(state: any) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    console.warn("Could not save state");
  }
}

export function clearAppState() {
  localStorage.removeItem(KEY);
}

export function compressImage(file: File, callback: (data: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const max = 420;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL("image/jpeg", 0.78));
    };
    img.src = String(reader.result);
  };
  reader.readAsDataURL(file);
}
