# Ripple Toggle — Theme Switcher

A responsive dark/light theme switcher with seven selectable animated transitions.

## Features

- Dark and light themes with saved preferences.
- Seven transitions: water ripple, 3D solving cube, chessboard, layered wind, unfolding paper, growing tree, and cloud & rain.
- Choose an animation independently from the theme toggle.
- Selected theme and animation preferences are saved in the browser.
- Responsive layout, keyboard support, and reduced-motion accessibility.
- Every transition works in both directions: dark to light and light to dark.

## Files

- `index.html` — page structure, animation selector, and scene elements.
- `style.css` — themes, responsive layout, and transition keyframes.
- `script.js` — theme state, saved preferences, and animation controls.

## Run locally

Open `index.html` in a modern browser. No build step or dependencies are required.

## Publish with GitHub Pages

1. Open the repository's **Settings** tab.
2. Select **Pages** from the sidebar.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. Wait for GitHub Pages to publish the site and open the URL shown in the Pages section.

## Accessibility

The interface respects the operating system's reduced-motion preference and switches themes without large motion when reduced motion is enabled.
