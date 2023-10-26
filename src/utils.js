import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt'


export const createHash = async password => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}


export const isValidPassword = (user,password) => bcrypt.compareSync(password, user.password)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default __dirname