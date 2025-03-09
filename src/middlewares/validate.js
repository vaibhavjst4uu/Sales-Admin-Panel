// Joi validate method for validating incoming requests
const Validate = (schema) => (req, res, next) => {
    // Perform validation using Joi
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true,
    });

    if (error) {
        const errors = error.details.map(err => ({
            message: err.message.replace(/['"]+/g, ""),
            field: err.path[0],
        }));
        return res.status(422).json({
            result: 0,
            status: 422,
            msg: "Validation Errors",
            errors,
        });
    }

    // If validation passes, assign validated values (including decrypted ones) back to req.body
    req.body = value; // This will now contain the decrypted phone and OTP

    next();
};

module.exports = Validate;
