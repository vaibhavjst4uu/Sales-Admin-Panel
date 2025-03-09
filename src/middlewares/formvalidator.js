const { CustomError } = require("../utils/helper");
const { encrypt, decrypt } = require("../utils/incrypt_decrypt");

const checkreqBody = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return CustomError(res, 0, 404, "Request body is missing")
    }
    next();
}

const checkreqQuery = async (req, res, next) => {
    if (Object.keys(req.query).length === 0) {
        return CustomError(res, 0, 404, "Query params are missing")
    }
    next();
}

const checkreqParams = async (req, res, next) => {
    if (req.params.id == ":id" || req.params.id == undefined) {
        return CustomError(res, 0, 404, "Request parameter is missing")
    }
    next();
}

const trimRequestBody = (req, res, next) => {
    Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    });
    next();
};

module.exports = { checkreqBody, checkreqParams, checkreqQuery, trimRequestBody };