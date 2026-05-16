# Security Notes

ScamShield Senior is an educational cybersecurity awareness tool. It is not a bank, police system or official incident response service.

## Do Not Enter Secrets

Users should not enter:

- real passwords,
- full card numbers,
- PESEL numbers,
- PINs,
- bank authorization codes,
- private recovery phrases.

The app masks sensitive-looking long numbers in previews, but users should still avoid entering secrets.

## LocalStorage Limitations

Analysis history, trusted contacts, progress and settings are stored in browser LocalStorage. LocalStorage is not encrypted. Anyone with access to the same browser profile may be able to read saved data.

## No Backend Collection

The app has no backend in the MVP and does not collect messages on a server.

## No AI API Transmission

The analyzer is rule-based and local to the application. No message content is transmitted to a paid AI API.

## Responsible Disclosure

If you find a security issue in the repository, open a private report or contact the maintainer instead of publishing exploit details in a public issue.
