# Search Term Validation Application

A Node.js application for validating search terms with comprehensive testing and security analysis.

## Features

- Express.js web server with search term validation
- Comprehensive unit tests with Jest
- End-to-end testing with Selenium
- Code quality analysis with SonarQube
- Security scanning with dependency check
- ESLint static analysis
- Docker containerization
- GitHub Actions CI/CD pipeline

## Prerequisites

- Node.js 18 or higher
- Docker and Docker Compose
- Chrome browser (for Selenium tests)

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SSDPracticalTest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

4. **Run tests:**
   ```bash
   npm test
   npm run test:selenium
   ```

## Docker Setup

### Running with Docker Compose

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the services:**
   - Application: http://localhost
   - SonarQube: http://localhost:9000

### SonarQube Configuration

The SonarQube instance is pre-configured with:
- **Username:** `admin`
- **Password:** `2303296@SIT.singaporetech.edu.sg`

On first startup, SonarQube will use the default admin/admin credentials, then automatically update to the configured password.

### Running SonarQube Analysis

```bash
# Make sure SonarQube is running
docker-compose up sonarqube -d

# Run the analysis
npm run sonar
```

## GitHub Actions Workflows

The project includes several automated workflows:

### 1. Unit Tests (`test.yml`)
- Runs on push/PR to main/develop branches
- Executes Jest tests with coverage reporting
- Node.js 20 environment

### 2. Selenium Tests (`selenium-tests.yml`)
- End-to-end UI testing
- Chrome browser automation
- Application health checks

### 3. Dependency Check (`dependency-check.yml`)
- Security vulnerability scanning
- npm audit execution
- OWASP Dependency Check
- Artifact upload for reports

### 4. Code Analysis (`codeql.yml`)
- ESLint security analysis
- SARIF report generation
- GitHub Security tab integration

## Project Structure

```
├── .github/workflows/     # GitHub Actions workflows
├── app.js                # Main application file
├── app.test.js           # Unit tests
├── selenium-tests.js     # E2E tests
├── docker-compose.yml    # Docker services configuration
├── dockerfile            # Application container
├── sonar-project.properties  # SonarQube configuration
├── jest.config.js        # Jest testing configuration
├── eslint.config.js      # ESLint configuration
├── .env                  # Environment variables
└── .gitignore           # Git ignore rules
```

## Environment Variables

The application uses environment variables defined in `.env`:

- `SONARQUBE_ADMIN_USERNAME`: SonarQube admin username
- `SONARQUBE_ADMIN_PASSWORD`: SonarQube admin password
- `NODE_ENV`: Application environment (development/production)

## Development

### Running Tests

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# Selenium tests (requires app to be running)
npm start &
npm run test:selenium

# ESLint analysis
npm run lint
```

### Code Quality

- **SonarQube**: Code quality and security analysis
- **ESLint**: JavaScript linting and security rules
- **Jest**: Unit testing with coverage
- **Selenium**: End-to-end testing

## Security

- Dependency vulnerability scanning
- Static code analysis
- Security-focused ESLint rules
- OWASP Dependency Check integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

## License

This project is for educational purposes.
