# Raspberry Pi kiosk

The Pi runs only the interface and peripherals; AI and data stay on the SahyogAI server (PRD §26–27).

## Hardware
- Raspberry Pi 4/5 with Raspberry Pi OS (desktop)
- HDMI or DSI touch display
- USB or I2S microphone, speaker (3.5 mm/USB/HDMI audio)
- Wi-Fi or Ethernet
- Optional: USB/Pi camera for document photos (used by the `/documents` page)

## Setup
1. Deploy the SahyogAI server with HTTPS (see the main README). Microphones only work on HTTPS or localhost.
2. On the Pi: `sudo apt install chromium-browser` (preinstalled on most images).
3. Copy `start-kiosk.sh` to the Pi, `chmod +x start-kiosk.sh`.
4. Autostart it: add `@/home/pi/start-kiosk.sh` to `~/.config/lxsession/LXDE-pi/autostart`
   (or a `~/.config/autostart/sahyog.desktop` entry on Wayland images), with `SAHYOG_URL` exported in `~/.profile`.
5. Test audio: `arecord -d 3 test.wav && aplay test.wav`.

`--use-fake-ui-for-media-stream` auto-accepts the microphone prompt so no one needs a keyboard.
Hindi/Bengali text-to-speech needs matching system voices; if none are installed the kiosk shows the answer as text.
