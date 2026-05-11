export function getAppStoreUrl(): string {
  const ua = navigator.userAgent || navigator.vendor || "";
  const isApple = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua);
  return isApple
    ? "https://apps.apple.com/co/app/weincard/id6754571134"
    : "https://play.google.com/store/apps/details?id=com.weincard.app.idp";
}
