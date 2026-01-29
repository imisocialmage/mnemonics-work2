# App Assets Instructions

To finalize the app for the Google Play Store, please provide the following images in this directory (`/assets`):

1. **App Icon**: 
   - Rename your icon to `logo.png` or `icon.png`.
   - Recommended size: **1024x1024 pixels**.
   - Format: PNG.

2. **Splash Screen**:
   - Rename your splash screen to `splash.png`.
   - Recommended size: **2732x2732 pixels** (to cover all screen sizes).
   - Format: PNG.
   - If you have a dark mode version, name it `splash-dark.png`.

Once you have placed the files here, let me know, and I will run the command to generate all the necessary Android resource sizes for you:

```bash
npx capacitor-assets generate --android
```

I have placed placeholder images here currently to ensure the project structure is valid.
