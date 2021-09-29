import jwt from "jsonwebtoken";

const token = jwt.sign({_id: "something"}, "MY_SECRET_KEY", {expiresIn: "10s"})

console.log(token);

try {
    jwt.verify(token, "MY_SECRET_KEY")
} catch (error) {
    console.log(error);
}

