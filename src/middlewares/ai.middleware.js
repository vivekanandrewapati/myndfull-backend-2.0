// import { ApiError } from '../utils/ApiError.js';

// export const handleAIErrors = (err, req, res, next) => {
//     if (err.message.includes('API key')) {
//         throw new ApiError(500, "AI service configuration error");
//     }

//     if (err.message.includes('rate limit')) {
//         throw new ApiError(429, "AI service rate limit exceeded");
//     }

//     next(err);
// }; 