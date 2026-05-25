# Maestro E2E Tests

This directory contains end-to-end tests for the NestFeed/Groupify React Native Expo app using [Maestro](https://maestro.mobile.dev/).

## Prerequisites

1. Install Maestro CLI:
   ```bash
   brew install maestro
   ```

2. Start an emulator or connect a physical device:
   ```bash
   # For iOS
   npx expo run:ios
   
   # For Android
   npx expo run:android
   ```

## Running Tests

### Run all tests
```bash
maestro test maestro/
```

### Run a specific test
```bash
maestro test maestro/login-flow.yaml
```

### Run tests with a specific device
```bash
maestro test maestro/login-flow.yaml --device "iPhone 15"
```

### Run tests in headless mode (CI/CD)
```bash
maestro test maestro/ --headless
```

## Test Suite Overview

### Authentication Flows
| Test File | Description |
|-----------|-------------|
| `login-flow.yaml` | Complete login flow with valid credentials |
| `register-flow.yaml` | New user registration flow |
| `forgot-password-flow.yaml` | Password reset navigation |
| `invalid-login.yaml` | Error handling for invalid credentials |
| `registration-errors.yaml` | Validation error handling during registration |
| `oauth-login-options.yaml` | OAuth button visibility and error states |
| `logout-flow.yaml` | User logout flow |

### Navigation Flows
| Test File | Description |
|-----------|-------------|
| `complete-navigation.yaml` | Full navigation through all app sections |
| `complete-user-journey.yaml` | End-to-end user journey from registration to usage |
| `groups-listing.yaml` | Groups list navigation and search |
| `create-group.yaml` | New group creation flow |
| `channels-navigation.yaml` | Channels section navigation |
| `blog-navigation.yaml` | Blog section navigation |
| `websites-navigation.yaml` | Websites section navigation |
| `groupshelf-navigation.yaml` | Group Shelf navigation |
| `share-links-navigation.yaml` | Share Links navigation |

### Settings & Preferences
| Test File | Description |
|-----------|-------------|
| `settings-navigation.yaml` | All settings sections navigation |
| `account-settings.yaml` | Account settings page |
| `dark-mode-toggle.yaml` | Dark mode appearance toggle |

## Test Structure

Each test file follows this structure:
```yaml
appId: com.groupifyapp
env:
  TEST_EMAIL: "demo@demo.com"
  TEST_PASSWORD: "teste1234"

---
- launchApp
- assertVisible: "Welcome Back"
- tapOn: "Email"
- inputText: "${TEST_EMAIL}"
- tapOn: "Sign In"
- assertVisible: "Dashboard"
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TEST_EMAIL` | Test user email | `demo@demo.com` |
| `TEST_PASSWORD` | Test user password | `teste1234` |
| `TEST_NAME` | Test user name | `Test User` |

## CI/CD Integration

Add to your CI/CD pipeline:
```yaml
- name: Run Maestro E2E Tests
  run: maestro test maestro/ --format junit
```

## Troubleshooting

1. **Tests failing due to loading states**: Add `waitForAnimationToEnd` after network requests
2. **Element not found**: Check if the element has a unique `text`, `placeholder`, or `id`
3. **Slow tests**: Use `speed: "fast"` for swipe operations
4. **Emulator issues**: Ensure the emulator is fully booted before running tests

## Contributing

1. Create a new test file in the `maestro/` directory
2. Follow the naming convention: `<feature>-<action>.yaml`
3. Include environment variables if needed
4. Add assertions to verify the expected UI state
5. Run `maestro test <your-test.yaml>` to verify

## Useful Commands

```bash
# List all available devices
maestro device list

# Start a new test recording
maestro record maestro/new-test.yaml

# Format test files
maestro format maestro/

# Dry run (validate syntax only)
maestro test maestro/ --dry-run
```
