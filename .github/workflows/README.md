# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the WarrantyIt project.

## Workflows

### 1. Main Pipeline (`main.yml`)
The main CI/CD pipeline that orchestrates all other workflows:
- Runs tests and linting
- Performs code quality checks
- Executes test matrix across Node.js versions
- Runs security audits
- Verifies build processes
- Provides a comprehensive summary

### 2. CI Pipeline (`ci.yml`)
Core continuous integration workflow:
- **Backend Tests**: Runs Jest tests with PostgreSQL service
- **Frontend Tests**: Runs Vitest tests
- **Linting**: ESLint checks for both projects
- **Type Checking**: TypeScript compilation checks
- **Build Verification**: Ensures both projects build successfully

### 3. Code Quality (`code-quality.yml`)
Code quality and style checks:
- ESLint validation for both backend and frontend
- TypeScript type checking
- TODO/FIXME comment detection
- Console.log statement detection in production code

### 4. Test Matrix (`test-matrix.yml`)
Cross-version compatibility testing:
- Tests on Node.js versions 16, 18, and 20
- Runs for both backend and frontend
- Ensures compatibility across different Node.js versions

### 5. Dependencies (`dependencies.yml`)
Dependency management and security:
- Weekly dependency audits
- Security vulnerability checks
- Outdated package detection
- Dependency report generation

## Workflow Triggers

All workflows are triggered by:
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop` branches
- **Manual dispatch** (where applicable)

## Environment Variables

The workflows use the following environment variables:

### Backend
- `DATABASE_URL`: PostgreSQL connection string for tests
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to `test` for testing environment

### Frontend
- Standard Vite/React environment variables

## Services

### PostgreSQL
- **Image**: `postgres:15`
- **Database**: `warranty_it_test`
- **Port**: `5432`
- **Health Check**: Configured with retries

## Matrix Strategy

The test matrix runs on:
- **Node.js Versions**: 16, 18, 20
- **Projects**: backend, frontend

## Security Features

- **Dependency Audits**: Regular security vulnerability checks
- **High-Severity Alerts**: Fails pipeline on high-severity vulnerabilities
- **Console Log Detection**: Prevents console statements in production code
- **TODO Detection**: Ensures code quality by flagging incomplete work

## Build Artifacts

The workflows verify:
- **Backend**: TypeScript compilation to `dist/` directory
- **Frontend**: Vite build to `dist/` directory
- **Dependencies**: All required packages are properly installed

## Status Checks

The main pipeline requires all jobs to pass:
- ✅ Tests & Linting
- ✅ Code Quality
- ✅ Test Matrix
- ✅ Security Audit
- ✅ Build Verification

## Manual Triggers

Some workflows support manual triggering:
- **Dependencies**: Can be run manually for immediate dependency checks
- **Main Pipeline**: Can be triggered manually for full pipeline execution

## Monitoring

Each workflow provides:
- **Detailed Logs**: Step-by-step execution logs
- **Status Summary**: Clear pass/fail indicators
- **Artifact Reports**: Generated reports for dependencies and security
- **Build Verification**: Confirmation of successful builds

## Troubleshooting

### Common Issues

1. **Test Failures**: Check test logs for specific error messages
2. **Linting Errors**: Review ESLint output for code style issues
3. **Build Failures**: Verify TypeScript compilation and dependency installation
4. **Security Alerts**: Address high-severity vulnerabilities immediately

### Debug Steps

1. Check individual job logs
2. Verify environment variables
3. Ensure all dependencies are properly installed
4. Review code quality checks for specific issues
