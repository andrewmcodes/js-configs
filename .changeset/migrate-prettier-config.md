---
"@andrewmcodes/prettier-config": minor
---

Migrate into the `js-configs` monorepo. Add an `exports` field and declare `prettier` (`>=3.0.0`) as a peer dependency to follow Prettier's shareable-config best practices. The config behavior is unchanged (`printWidth: 120`, `endOfLine: "auto"`).
