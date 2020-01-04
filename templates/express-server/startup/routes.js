const express = require("express");
//get routes here
const error = require("../middleware/error");

module.exports = function(app) {
    app.use(express.json());
    // add routes here
    app.use(error);
};
