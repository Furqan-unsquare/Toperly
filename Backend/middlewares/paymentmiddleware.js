import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

export const checkJwt = jwt({
  // Dynamically provide a signing key
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: process.env.AUTH0_AUDIENCE, // must match API Identifier in Auth0
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});
