# Rydo Android App Setup

The PWA (Next.js side) is already configured. Follow these steps once the site is deployed.

## Step 1 — Install prerequisites (one-time)

```bash
brew install openjdk@17
npm install -g @bubblewrap/cli
```

## Step 2 — Generate the Android project

```bash
cd android-twa
bubblewrap init --manifest https://rydo.autos/manifest.webmanifest
```

When prompted, enter:
- **Domain**: rydo.autos
- **Application ID**: com.rydo.autos
- **App name**: Rydo
- **Launcher icon**: ../public/icons/icon-512.png
- **Signing key password**: choose a strong password and SAVE IT

Bubblewrap will auto-download the Android SDK if needed.

## Step 3 — Build the app

```bash
bubblewrap build
```

This produces:
- `app-release-bundle.aab` → upload this to Google Play
- `app-release-signed.apk` → install on your phone for testing

## Step 4 — Get your SHA-256 fingerprint

```bash
keytool -list -v -keystore ./android-signing-key.jks | grep SHA256
```

Copy the fingerprint (format: `AA:BB:CC:...`)

## Step 5 — Update assetlinks.json

Open `public/.well-known/assetlinks.json` in the main project and replace
`REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual fingerprint.

Commit and push — this makes the URL bar disappear in the app (full-screen native look).

## Step 6 — Test on your phone

```bash
adb install app-release-signed.apk
```

## Step 7 — Publish to Google Play

1. Go to https://play.google.com/console
2. Create new app → upload `app-release-bundle.aab`
3. Fill in store listing, screenshots, content rating
4. Submit for review (~1-3 days)

## ⚠️ Important

Keep `android-signing-key.jks` safe — losing it means you cannot update the app on Play Store.
