# Contributing to GoSync

First off, thank you for considering contributing to GoSync! 🎉

It's people like you that make GoSync such a great tool for the developer community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold this code:

- **Be respectful** - Treat everyone with respect and kindness
- **Be constructive** - Provide helpful feedback and suggestions
- **Be patient** - Remember that everyone was a beginner once
- **Be inclusive** - Welcome newcomers and help them get started

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Basic knowledge of React and Next.js

### Quick Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/gosync-zero.git
cd gosync-zero

# 3. Add upstream remote
git remote add upstream https://github.com/HarshalPatel1972/gosync-zero.git

# 4. Install dependencies
npm install

# 5. Start development server
npm run dev
```

---

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Found a bug? Please open an issue with:

1. **Clear title** - A concise description of the bug
2. **Steps to reproduce** - How can we recreate the issue?
3. **Expected behavior** - What should happen?
4. **Actual behavior** - What actually happened?
5. **Screenshots** - If applicable
6. **Environment** - Browser, OS, Node version

### 💡 Suggesting Features

Have an idea? We'd love to hear it!

1. Check existing issues to avoid duplicates
2. Open a new issue with the `enhancement` label
3. Describe the feature and its use case
4. Explain why it would benefit users

### 📝 Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples or code snippets
- Translate documentation
- Improve the README

### 💻 Contributing Code

Ready to code? Here's how:

1. Look for issues labeled `good first issue` or `help wanted`
2. Comment on the issue to claim it
3. Fork, code, and submit a PR

---

## 🛠️ Development Setup

### Project Structure

```
gosync-zero/
├── app/                    # Next.js App Router pages
│   ├── docs/              # Documentation pages
│   └── page.js            # Landing page
├── components/            # React components
│   ├── docs/             # Documentation components
│   └── *.jsx             # Landing page components
├── content/              # MDX documentation files
│   └── docs/
└── public/               # Static assets
```

### Running Tests

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

No environment variables are required for local development.

---

## 📥 Pull Request Process

### Before Submitting

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the style guidelines
   - Test your changes locally

4. **Commit with a clear message**
   ```bash
   git commit -m "feat: add new feature description"
   ```

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

**Examples:**
```
feat: add dark mode toggle
fix: resolve mobile menu overlap
docs: update installation guide
```

### Submitting the PR

1. Push your branch: `git push origin feature/your-feature-name`
2. Open a Pull Request on GitHub
3. Fill out the PR template
4. Link any related issues
5. Wait for review

### Review Process

- A maintainer will review your PR
- Address any requested changes
- Once approved, your PR will be merged! 🎉

---

## 🎨 Style Guidelines

### JavaScript/React

- Use **functional components** with hooks
- Use **CSS Modules** for styling (`.module.css`)
- Follow existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic

### CSS

- Use CSS custom properties (variables)
- Follow the existing naming conventions
- Ensure responsive design
- Test on multiple browsers

### File Naming

- Components: `PascalCase.jsx`
- Styles: `PascalCase.module.css`
- Utils: `camelCase.js`
- MDX: `kebab-case.mdx`

---

## 🙏 Thank You!

Every contribution, no matter how small, makes a difference. Whether you're:

- Fixing a typo
- Reporting a bug
- Suggesting a feature
- Writing code

**You're helping make GoSync better for everyone!**

---

<div align="center">

**Questions?** Open an issue or reach out to [@HarshalPatel1972](https://github.com/HarshalPatel1972)

Made with ❤️ by the GoSync community

</div>
