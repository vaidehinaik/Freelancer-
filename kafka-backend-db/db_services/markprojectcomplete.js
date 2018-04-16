var mongo = require("../mongo/mongo");
var projectsModel = require('../models/Projects');

handle_request = ((data, callback) => {
    var response = {};
    try {
      console.log("Data received for mongo: "  + JSON.stringify(data));
      projectsModel.findOneAndUpdate({projectId: data.projectId},
        {completed: 1},
        {new: true},
        function (err, updatedData) {
          if (err) {
            console.log("error: " + err);
            throw err;
          }
          console.log("updated user data: " + JSON.stringify(updatedData));
          if(updatedData.nModified !== 0) {
            response.status = 201;
            response.message = "Project marked as complete successfully";
            callback(err, response);
          } else {
            response.status = 401;
            response.message = "Error while marking project as complete";
            callback(error, response);
          }
      });
    } catch (error) {
        console.log("ERROR: " + error);
        response.status = 401;
        response.message = "Error while marking project as complete";
        callback(error, response);
    }
});

exports.handle_request = handle_request;
