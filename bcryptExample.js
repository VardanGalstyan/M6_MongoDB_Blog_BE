import bcrypt from 'bcrypt'

const plainPW = 'abcdfdfdf&&43##$$#4@#$243434'
const numberOfPrams = 10

console.time('bcrypt')
const hash = bcrypt.hashSync(plainPW, numberOfPrams)
console.log(hash);
console.timeEnd('bcrypt')