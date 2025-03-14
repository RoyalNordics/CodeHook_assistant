# Setting up the project on GitHub

## Pre-push Checklist
1. Ensure you have Git installed locally
2. Make sure you have a GitHub account and access to the repository
3. Verify that `.env` is in `.gitignore` (it is!)

## Push Instructions

1. Initialize Git (if not already done):
```bash
git init
```

2. Configure Git (replace with your details):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

3. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

4. Create and configure your .env file:
```bash
cp .env.example .env
# Edit .env with your actual API keys
```

5. Add and commit files:
```bash
git add .
git commit -m "Initial commit"
```

6. Push to GitHub:
```bash
git push -u origin main
```

## Post-push Setup
1. Set up branch protection rules in GitHub repository settings
2. Add any necessary GitHub Actions for CI/CD
3. Configure environment secrets in GitHub repository settings

## Important Notes
- Never commit `.env` file with real credentials
- Keep `node_modules` in `.gitignore`
- The database will need to be set up separately in your deployment environment
