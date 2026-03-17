export function generateStudentId() {

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let randomPart = "";

for (let i = 0; i < 6; i++) {

randomPart += characters.charAt(
Math.floor(Math.random() * characters.length)
);

}

return "STU-" + randomPart;

}