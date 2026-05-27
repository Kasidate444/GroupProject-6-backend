import { User } from '../models/user.model.js';


export const register = async (req, res) => {
    const { username, email, password, role } = req.body

    const newUser = { ...req.body, }
}