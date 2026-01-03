# Contributing to Kanakkan

Thank you for your interest in contributing to Kanakkan! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/kanakkan.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Open a Pull Request

## Development Setup

1. Install dependencies: `npm install`
2. Copy environment variables: `cp .env.example .env.local`
3. Configure your `.env.local` file
4. Seed the database: `npm run seed`
5. Start the dev server: `npm run dev`

## Code Style

- Follow the project's coding standards in `cursor_rules.md`
- Use TypeScript with strict mode
- Prefer functional components and hooks
- Keep files under 150 lines
- Use named exports
- Follow the existing module pattern

## Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Reference issues when applicable

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Run `npm run lint` and fix any issues
3. Run `npm run format:check` to ensure formatting is correct
4. Update documentation if needed
5. Add tests if applicable
6. Ensure all tests pass

## Reporting Issues

When reporting issues, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, Node version, etc.)

## Feature Requests

For feature requests, please:
- Describe the feature clearly
- Explain the use case
- Discuss potential implementation approaches
- Consider backwards compatibility

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing! 🎉

