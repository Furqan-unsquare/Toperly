// src/routes/publicRoutes.ts
const publicRoutes = [
  "/",
  "/courses",
  "/courses/:courseId", // allow dynamic ID
  "/contact-us",
  "/subscription-plans",
  "/blogs",
  "/auth/login",
  "/auth/instructor",
  "/auth/admin",
  "auth/subadmin"
];

export default publicRoutes;
