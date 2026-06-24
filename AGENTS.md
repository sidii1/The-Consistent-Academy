# The Consistent Academy - Agent Directives

## Project Overview

This repository contains the source code for The Consistent Academy, a modern e-learning platform. The directives within this document are strictly designed to guide artificial intelligence coding agents in maintaining, expanding, and refactoring the codebase efficiently. Agents must prioritize thoroughness, logical depth, and clean execution in every task.

## Technology Stack

Agents must strictly adhere to the following technological choices and frameworks when generating or modifying code:

* **Package Management:** The project utilizes Bun as the primary package manager, evidenced by the `bun.lockb` file. All dependency installations and script executions must use `bun` commands (e.g., `bun install`, `bun run`) instead of `npm` or `yarn`.


* **Frontend Architecture:** The application features a web frontend with an `index.html` entry point at the root. Styling is handled via Tailwind CSS, configured through `postcss.config.js`.


* **UI Components:** The presence of `components.json` signifies the integration of `shadcn/ui`. Agents must follow the established design system and utilize these standardized components for any new interface elements to maintain visual consistency.


* **Backend & Serverless:** The architecture employs a hybrid serverless approach. Firebase is configured for the project (`firebase.json`, `.firebaserc`). Additionally, standalone serverless API routes exist outside of Firebase, such as the `api/contact.ts` endpoint.



## Architectural Rules and Conventions

### Media and Storage Handling

When implementing features that require dynamic media storage or image hosting, strictly utilize Cloudinary rather than Firebase Storage. This architectural decision accommodates specific project pricing constraints. Ensure all dynamic media upload logic points directly to the Cloudinary cloud name `dftodlkkt`.

For local static assets, refer exclusively to the `public/` directory. The repository already contains categorized visual assets, such as literature covers located in `public/books/` (e.g., `101-management.jpg`, `cakewalk-ielts.jpg`) and educational material graphics systematically ordered in `public/courses/` (e.g., `img1.png` through `img14.png`).

### Firebase Functions Ecosystem

* All Firebase Cloud Functions must reside inside the dedicated `functions/src/` directory, utilizing `index.ts` as the primary entry point.


* Strict TypeScript typing is mandatory, governed by both `functions/tsconfig.json` and `functions/tsconfig.dev.json`.


* Ensure any new dependencies required for cloud functions are added specifically to the `functions/package.json` file, keeping them isolated from the root `package.json`.



### Code Quality and Formatting

* Linting rules are strictly defined by `eslint.config.js` at the project root, alongside a specific `.eslintrc.js` within the functions directory. Agents must ensure all generated code passes these linting checks without triggering warnings or errors.


* Write eloquent, highly readable code using simple language for variables and functions. Include comprehensive comments explaining the reasoning behind complex logic. Depth and thoroughness must never be compromised for the sake of brevity.

### Custom Scripts and Design Specifications

* The root directory contains a custom script named `apply_soft_noir.cjs`. Agents should interact with or modify this script only when explicitly instructed to alter the thematic or build configurations it governs.


* Always consult `DESIGN.md` before making any layout, color, or typographical changes to ensure strict alignment with the brand identity of The Consistent Academy.



## File Structure Map

To maintain structural integrity, agents should familiarize themselves with the core project layout:

* **`api/`**: Contains standalone serverless endpoints tailored for specific integrations (e.g., contact forms).


* **`functions/`**: Houses all backend Firebase Cloud Functions, their specific dependencies, and TypeScript configurations.


* **`public/`**: Stores all static public-facing assets, including markdown documents like `CC Club.md` and raw data files like `courses.txt`.


* **Root Configuration**: Contains essential environment and build files, including `package.json`, `components.json`, and `firebase.json`.