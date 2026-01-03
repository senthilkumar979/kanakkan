# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities by emailing the maintainers directly. Do not open a public issue.

When reporting a vulnerability, please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work with you to address the vulnerability.

## Security Best Practices

When deploying Kanakkan:

1. **Never commit secrets** - Use environment variables for all sensitive data
2. **Use strong JWT secrets** - Generate random strings at least 32 characters long
3. **Enable HTTPS** - Always use HTTPS in production
4. **Keep dependencies updated** - Regularly update npm packages
5. **Use secure database connections** - Use MongoDB Atlas or secure your MongoDB instance
6. **Review environment variables** - Ensure no secrets are exposed in logs or error messages

## Known Security Considerations

- JWT tokens are stored in HTTP-only cookies
- Passwords are hashed using bcrypt with 12 salt rounds
- All API routes require authentication (except auth endpoints)
- Environment variables are validated using Zod schemas

