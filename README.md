# Workout Tracker App

## Overview

### Purpose
A simple workout tracker that allows users to:
- Create workout templates
- Log workouts
- View workout history
- Track progress through graphs or charts

### Background
Many existing workout apps are bloated and include unnecessary features.  
This app focuses on **simplicity** and the **speed of logging workouts**, making it fast and easy to use.

## Available Scripts

In the project directory, you can run:

### `npm start`

Starts the app in development mode.

- **On your phone:** Scan the QR code displayed in the terminal to open the app in **Expo Go**.
- **On your computer:** Open an **Android** or **iOS** emulator to run the app locally.

The development server will automatically reload when you make changes to the code.
## 🧾 Commit Naming Convention

This project follows a standardized commit message format.  
**Please follow the types below when writing commits:**

### Allowed Commit Types

| Type       | Description                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | A new feature                                     |
| `fix`      | A bug fix                                         |
| `style`    | Code formatting only (e.g., spacing, indentation) |
| `chore`    | Changes to tooling, configs, or dependencies      |
| `refactor` | Code changes that don't add features or fix bugs  |
| `docs`     | Documentation-only changes                        |
| `test`     | Adding or updating tests                          |
| `perf`     | Performance improvements                          |
| `ci`       | CI/CD pipeline or automation changes              |

### Example Commit Messages

feat: add responsive hamburger menu for mobile
fix: correct scroll behavior on navigation links
style: fix CSS spacing in header component

## 📝 Code Commenting Guidelines

To maintain code clarity and help future contributors understand the functionality, **all components** should be well-commented, explaining their purpose, features, and any important details. This helps anyone new to the project quickly grasp how the code works.

### Comment Format

Each component should have a **header comment** at the top, describing:

- What the component does
- Key elements or features inside the component
- Any styling or layout details that are important

**Example:**

```bash
/**
 * HeroSection component
 *
 * This component renders a hero section at the top of the page.
 * It includes:
 * - A headline describing the service.
 * - A short paragraph explaining the key benefits.
 * - A call-to-action button ("Get Started").
 * - A background image that complements the theme.
 *
 * The section is styled to overlay the text and button on top of the image
 */
```

### Why This Matters

- **Readability:** Clear, descriptive comments make it easier for anyone (including yourself) to jump into the project at any time and understand how a component works.
- **Maintainability:** As the project grows, well-commented code is easier to modify without breaking functionality.
- **Collaboration:** When multiple people are working on the project, consistent comments ensure that everyone is on the same page.
