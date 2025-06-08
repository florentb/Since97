# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a wedding website for Marina & Florent built with vanilla JavaScript and SCSS, using Parcel for build tooling. The site features smooth scrolling animations powered by the Skrollr library and is optimized for desktop/tablet viewing.

## Development Commands

- `npm run dev` - Start development server with Parcel
- `npm run build` - Build production bundle
- `npm run preview` - Build and serve production bundle locally
- `npm run lint:js` - Lint JavaScript files with ESLint
- `npm run lint:styles` - Lint SCSS files with Stylelint

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `master` branch. The workflow:

1. Builds the site using Parcel
2. Uploads the `dist/` folder as a Pages artifact
3. Deploys to GitHub Pages

Live site: https://florentb.github.io/Since97

## Architecture

The project uses Parcel as a zero-configuration build tool with the following structure:

- **Entry point**: `src/index.html` which imports `src/js/app.js` and `src/style/main.scss`
- **Build output**: `dist/` directory with bundled and optimized assets
- **Static assets**: `src/static/` automatically processed and copied during build
- **Asset handling**: Parcel automatically handles all asset imports and optimizations

The main application (`src/js/app.js`) initializes a scroll-based animation system using Skrollr, with mobile detection that shows an alert for mobile users to use desktop/tablet instead. The site uses a step-based scroll system with calculated viewport-relative positions.

Styling uses SCSS with normalize-scss as a base, featuring a pink theme color (`#e5007d`) and custom typography with BenchNine and Great Vibes fonts. Parcel automatically compiles SCSS and handles autoprefixing.
