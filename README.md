# Longhorn Studies

### Buid Badges

* [![Expo][Expo]][Expo-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![React Native][React-Native]][React-Native-url]
* [![NativeWind][NativeWind]][NativeWind-url]

## Table of Contents
- [Concise Description](#concise-description)
- [Overview](#overview)
  - [Problem Statement](#problem-statement)
  - [Solution](#solution)
- [Key Features and Benefits](#key-features-and-benefits)
- [Target Audience](#target-audience)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation Steps](#installation-steps)
  - [Configuration Requirements](#configuration-requirements)
- [Architecture](#architecture)
  - [High-Level Architecture Overview](#high-level-architecture-overview)
  - [Key Components](#key-components)
  - [Design Principles](#design-principles)
- [Development Workflow](#development-workflow)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Conventional Commits](#conventional-commits)
  - [Pull Request Process](#pr-process)
  - [Testing Expectations](#testing-expectations)
  - [Contribution Guidelines](#contribution-guidelines)
  - [Code of Conduct](#code-of-conduct)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Open Source License](#open-source-license)
- [Links](#links)


### Concise Description
Longhorn Studies is a mobile app intended to help UT students find new study spots and form study groups for assignments, projects, or exams.


## Overview

### Problem Statement:
UT's campus is large with many buildings, so it can be daunting to explore new locations to study. It can also be challenging to find peers to collaborate with when studying for exams or other course content.

### Solution:
Longhorn Studies provides a centralized, student-friendly platform that helps UT students discover and share new study spots on campus. It also makes it easy to connect with classmates by forming or joining study groups based on courses, exams, or assignments.


### Key Features and Benefits
- Share study spots with other students
- Rate other study spots shared by students
- Form study groups with classmates

### Target Audience
- UT Students

## Getting Started 

### Prerequisites
- TBD

### Installation steps
```

```

### Configuration requirements
- TBD

## Architecture
- Platform/Toolchain: Expo
- UI/Moible Framework: React Native
- Programming Language: TypeScript
- Styling: NativeWind
- Backend: Supabase
- User Authentication: Supabase
- Database: Supabase
  
### Key components
- User profiles
- Study spots/rating system
- Forming/joining study groups

### Design principles
- TBD

## Development Workflow
### Branch naming conventions + Conventional Commits
We follow the Conventional Commits specification for commit messages. This ensures a consistent commit history and enables automated versioning and changelog generation.

### Branch Naming Conventions 
```
<type>/<short-description>
```
Examples: 
- feature/{feature-name}
- fix/{bug-description}
- docs/{documentation-change}
### Commit Message
Follow this structure for commit messages
```
<type>(<scope>): <subject>
```
Where:
```type``` has one of the following:
- feat: New features
- fix: Bug fixes
- docs: Documentation changes
- style: Code formatting only
- refactor: Code changes without behavior change
- test: Adding or updating tests
- chore: Build process or tooling updates

### PR process
- Fork or branch from main
- Create a PR with a clear description
- Ensure checks pass (build, lint, test)
- Request review before merging

### Testing expectations
- Unit tests for UI components
- Integration tests for feature flows

### Contribution guidelines & Code of conduct reference
We welcome all to contribute! Please carefully read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before getting started. All contributors must adhere to our Code of Conduct

## Available Scripts
-  ``pnpm dev``         # Start dev server
- ``pnpm build ``      # Build project for production
- ``pnpm preview ``    # Preview production build locally
- ``pnpm lint ``       # Lint codebase
- ``pnpm format ``     # Format code using Prettier

### Development commands
- TBD
### Building commands
- TBD
### Testing commands
- TBD
### Linting & formatting commands
- TBD

## Project Structure
- TBD
### Directory organization
- TBD
### Key files and their purposes
- TBD

## Deployment
### Environment information
- TBD
### Deployment process
- TBD
### Configuration details
- TBD

## Open Source License
- TBD


[Expo]: https://img.shields.io/badge/Expo-000.svg?style=for-the-badge&logo=expo&logoColor=white
[Expo-url]: https://expo.dev/

[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/

[React-Native]: https://img.shields.io/badge/React_Native-20232A.svg?style=for-the-badge&logo=react&logoColor=61DAFB
[React-Native-url]: https://reactnative.dev/

[NativeWind]: https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white
[NativeWind-url]: https://www.nativewind.dev/

