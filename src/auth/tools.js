import jwt from "jsonwebtoken";

const generateJWT = (payload) =>
    new Promise((res, rej) =>
        jwt.sign(
            payload,
            process.env.MY_SECRET_KEY,
            { expiresIn: "1 week" },
            (err, token) => {
                if (err) rej(err);
                res(token);
            }
        )
    );

export const verifyJWT = (token) =>
    new Promise((res, rej) =>
        jwt.verify(token, process.env.MY_SECRET_KEY, (err, decodedToken) => {
            if (err) rej(err);
            res(decodedToken);
        })
    );

export const generateJWToken = async (author) => {
    const accessToken = await generateJWT({ _id: author._id })
    return accessToken
}