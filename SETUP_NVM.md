# Setting Up nvm-windows

## Step 1: Download and Install nvm-windows

1. Download the latest release from: https://github.com/coreybutler/nvm-windows/releases
2. Download `nvm-setup.exe` (the installer)
3. Run `nvm-setup.exe` **as Administrator**
4. Follow the installation wizard (default settings are fine)
5. **Close and reopen your terminal/PowerShell** after installation

## Step 2: Verify Installation

Open a new PowerShell window and run:
```powershell
nvm version
```

You should see something like `1.1.12` or similar.

## Step 3: Install Node.js 22.17.0

From your project directory, run:
```powershell
nvm install 22.17.0
```

## Step 4: Use the Project's Node Version

Since your project has a `.nvmrc` file, you can use:
```powershell
nvm use
```

Or explicitly:
```powershell
nvm use 22.17.0
```

## Step 5: Verify Node Installation

```powershell
node --version
```

Should output: `v22.17.0`

## Step 6: Install Project Dependencies

```powershell
npm install
```

## Common nvm Commands

- `nvm list` - List installed Node versions
- `nvm install <version>` - Install a specific Node version
- `nvm use <version>` - Switch to a Node version
- `nvm use` - Use the version specified in `.nvmrc` (if present)
- `nvm current` - Show currently active Node version

## Troubleshooting

- **"nvm is not recognized"**: Make sure you restarted your terminal after installation
- **Permission errors**: Run PowerShell as Administrator
- **Version not found**: Make sure you're using the exact version number (e.g., `22.17.0` not `22.17`)
