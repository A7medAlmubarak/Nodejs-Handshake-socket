
const bcrypt = require("bcrypt");
const RError = require("../..//core/error.response.js");
const {Model} = require("../../database/config");
const loginValidator = async (name,password) => {




    if (!name || !password) {
        throw new RError(400, "All fields are required");
    }

    const user = await Model.User.findOne({where: {name} });

    if (user == null) {

        throw new RError(401, "wrong credentials");
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
        throw new RError(401, "wrong credentials");

    }

    return user;
}

module.exports = {loginValidator};