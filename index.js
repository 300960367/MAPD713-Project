/**************************************************************************************
  * MAPD713 - Enteprise Technologies for Mobile Platforms
  *
  * Student Name: Fernando Ito
  * Student ID: 300960367
  * File: index.js - last updated: 10/01/2017
  * Description: Project Hospital App
  * gitHub: https://github.com/300960367/MAPD714-Assignment1
  * Version: 0.1 - Delete All function.
  **************************************************************************************/

var SERVER_NAME = 'user-api'
var PORT = 8000;
var HOST = '127.0.0.1';
var ctGet = 0;
var ctPost = 0;
var ctDelete = 0;

var restify = require('restify')

  // Get a persistence engine for the patients
  , patientsSave = require('save')('patients')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, HOST, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /patients')
  console.log(' /patients/:id')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all patients in the system
server.get('/patients', function (req, res, next) {

    // Find every entity within the given collection
    patientsSave.find({}, function (error, patients) {

    // Return all of the patients in the system
    res.send(patients)
  })
})

// Get a single user by their user id
server.get('/patients/:id', function (req, res, next) {

  // Find a single user by their id within save
  patientsSave.findOne({ _id: req.params.id }, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (patient) {
      // Send the patient if no issues
      res.send(patient)
    } else {
      // Send 404 header if the patient doesn't exist
      res.send(404)
    }
  })
})

/*******************************
 * Create a new patient
 * POSTMAN:
 * POST JSON (application/json)
 * {"name":"Peter","age":"25"}
 *******************************/

server.post('/patients', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }
  var newPatient = {
		name: req.params.name,
		age: req.params.age
	}

  // Create the patient using the persistence engine
  patientsSave.create( newPatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the patient if no issues
    res.send(201, patient)

    ctPost++
    console.log("Posts: " + ctPost)

  })
})

// Update a patient by their id
server.put('/patients/:id', function (req, res, next) {

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.age === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('age must be supplied'))
  }

  var newPatient = {
		_id: req.params.id,
		name: req.params.name,
		age: req.params.age
	}

  // Update the patient with the persistence engine
  patientsSave.update(newPatient, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send(200)
  })
})

// Delete All patients
server.del('/patients/deleteall', function (req, res, next) {

    // reset the given collection
    patientsSave = require('save')('patients')

    // Send a 200 OK response
    res.send("All records deleted.")
})


// Delete patient with the given id
server.del('/patients/:id', function (req, res, next) {

  // Delete the patient with the persistence engine
  patientsSave.delete(req.params.id, function (error, patient) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
  })
})
