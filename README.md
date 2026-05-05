# Cockpit Plugin for Mihomo

This project is a Cockpit plugin designed to manage the Mihomo systemd service. It is built upon a flexible architecture that supports configuration via environment files.

## Features

- **Dashboard**: Monitor Mihomo service status (Active/Inactive) with Start/Stop/Reload controls.
- **Logs**: Integrated journalctl log viewer for Mihomo.
- **Config Editor**: Direct text editor for Mihomo configuration file (`config.yaml`) with "Apply Changes" (Save & Reload) support.
- **Settings**: Persistent configuration for Service Name, Config Path, and Web UI URL (with `{hostname}` support).

---

## Development Dependencies

On Debian/Ubuntu:

    sudo apt install gettext nodejs npm make

On Fedora:

    sudo dnf install gettext nodejs npm make

On openSUSE Tumbleweed and Leap:

    sudo zypper in gettext-runtime nodejs npm make

---

## Setup & Configuration

This plugin uses an environment file `.env.mihomo` to define defaults.

Example `.env.mihomo`:
```env
# Project Configuration
APP_NAME=Mihomo
APP_LABEL="Mihomo Manager"
APP_DESCRIPTION="Cockpit plugin for managing Mihomo service"

# Default Service Settings
DEFAULT_SERVICE_NAME=mihomo
DEFAULT_CONFIG_PATH=/etc/mihomo/config.yaml
DEFAULT_WEB_UI_URL=http://{hostname}:9090

# Plugin Settings
CONFIG_STORAGE_PATH=/etc/cockpit/mihomo-plugin.json
```

### Build the Plugin
Run `make` with the `ENV` variable to select the Mihomo configuration:

```bash
# Build for Mihomo
make ENV=mihomo
```

---

## Development Workflow

1. **Build Project**:
   ```bash
   make ENV=mihomo
   ```

2. **Installation (Development)**:
   Run `make devel-install` to create a symlink to the Cockpit plugin directory.
   ```bash
   make devel-install
   ```

3. **Watch Mode**:
   Automatically update the bundle on every code change:
   ```bash
   make watch ENV=mihomo
   ```

4. **Uninstall (Development)**:
   ```bash
   make devel-uninstall
   ```

---

## Technical Details

### Project Structure
- `src/pages/`: Page components (Dashboard, Logs, Config Editor, Settings).
- `src/services/`: Logic for systemd and file system interaction.
- `src/manifest.json`: Plugin metadata (Label is auto-updated from `.env` during build).
- `build.js`: Build script handling `.env` injection and asset management.

### Coding Standards
- Uses [ESLint](https://eslint.org/) for JS/TS code style.
- Uses [Stylelint](https://stylelint.io/) for CSS/SCSS code style.
- Run `make codecheck` to verify code quality.

---

## Credits
This project was built using the [cockpit-service-template](https://github.com/yorihaput/cockpit-service-template) repository and the [Cockpit Starter Kit](https://github.com/cockpit-project/starter-kit) as a foundation.

## Further Reading
 * [Cockpit Deployment and Developer documentation](https://cockpit-project.org/guide/latest/)
 * [Make your project easily discoverable](https://cockpit-project.org/blog/making-a-cockpit-application.html)
