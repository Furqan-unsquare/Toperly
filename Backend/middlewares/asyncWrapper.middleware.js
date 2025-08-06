// import { ApiRes } from "../utils/ApiRes.js";

export const asyncWrapper = (reqHandler) => async (req, res, next) => {
  try {
    await reqHandler(req, res, next);
  } catch (error) {
    next(error)
  }
};

// export const asyncWrapper = (requesthandler) =>
//   async((req, res, next) => {
//     Promise.resolve(requesthandler(req,res,next)).catch(() => {
//       res.status(500).json({
//         success: false,
//         message: "Something went wrong",
//       });
//     });
//   });

// export const asyncWrapper = (requesthandler) =>
//     async((req, res, next) => {
//       requesthandler(req,res,next).catch(() => {
//         res.status(500).json({
//           success: false,
//           message: "Something went wrong",
//         });
//       });
//     });