# Pre-migration baseline

Pre-migration state = `main` @ 04b18d4 (10-zone Multi-Zones), fully recoverable by
abandoning `feat/single-origin-consolidation`.

Canonical URLs that must stay HTTP 200 after each migration task (served via hub :3000):
- /
- /website
- /portals/eutthan-admin   (already native)
- /portals/smile-admin
- /portals/pm-ajay
- /portals/scw
- /portals/nmba
- /portals/nhapoa
- /portals/tg
- /design-system
- /storybook/
