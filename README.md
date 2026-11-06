# Secret Calculator Android APK

This repository packages the supplied HTML app using Capacitor and builds a debug APK with GitHub Actions.

## Build
1. Upload all files in this folder to a GitHub repository on the `main` branch.
2. Open the repository's Actions tab.
3. Select **Build Secret Calculator APK** and press **Run workflow** (or wait for the push-triggered build).
4. Open the completed workflow run and download the `Secret-Calculator-debug-APK` artifact.
5. Extract the ZIP and install `app-debug.apk` on Android.

This is a debug APK for testing/sideloading, not a Play Store release.

## Important security note
The supplied HTML stores PIN values in browser localStorage and uses IndexedDB/local browser storage for data. A PIN is not encryption. Do not use it to protect highly sensitive files until proper encryption and backup access controls have been implemented and tested. Review the built-in cloud backup endpoint and its access rules before putting private media into it.


## App name and icon
The Android app name is set to `Calculator` in `capacitor.config.json`. The launcher icon source is `assets/icon.png`; the workflow generates Android icon sizes using `@capacitor/assets`.
