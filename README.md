# express-turtle-parser

This is for express applications where you who want to parse Turtle RDF on HTTP POST.

## Description

While it has not been the most used or the most cited tool, the use of RDF is rising. 

This uses n3 at its core. (https://github.com/RubenVerborgh/N3.js)

This was based on the very popular express-xml-bodyparser (https://github.com/macedigital/express-xml-bodyparser).

## Installation 

npm install express-turtle-parser

## Usage 

You can either use express-turtle-parser at application level, or for specific routes only. 

Here is an example of an express application with default settings:

````javascript
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    TurtleParser = require('express-turtle-parser');

app.use(TurtleParser());

app.post('/receive-turtle', function(req, res, next) {

  // req.triples array contains the parsed turtle

  // req.rawBody contains the raw file

});

// Save this in a file called provo-example.ttl 
// prov-o example from https://www.w3.org/TR/prov-o/

@prefix xsd:  <http://www.w3.org/2001/XMLSchema#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix prov: <http://www.w3.org/ns/prov#> .
@prefix :     <http://example.org#> .

:bar_chart
   a prov:Entity;
   prov:wasGeneratedBy  :illustrationActivity;
   prov:wasDerivedFrom  :aggregatedByRegions;
   prov:wasAttributedTo :derek;
.

:derek
   a foaf:Person, prov:Agent;
   foaf:givenName       "Derek";
   foaf:mbox            <mailto:derek@example.org>;
   prov:actedOnBehalfOf :natonal_newspaper_inc;
.

:national_newspaper_inc 
   a foaf:Organization, prov:Agent;
   foaf:name "National Newspaper, Inc.";
.

:illustrationActivity 
   a prov:Activity; 
   prov:used              :aggregatedByRegions;
   prov:wasAssociatedWith :derek;
   prov:wasInformedBy     :aggregationActivity;
.

:aggregatedByRegions
   a prov:Entity;
   prov:wasGeneratedBy  :aggregationActivity;
   prov:wasAttributedTo :derek;
.

:aggregationActivity
   a prov:Activity;
   prov:startedAtTime    "2011-07-14T01:01:01Z"^^xsd:dateTime;
   prov:wasAssociatedWith :derek;
   prov:used              :crimeData;
   prov:used              :nationalRegionsList;
   prov:endedAtTime      "2011-07-14T02:02:02Z"^^xsd:dateTime;
.

:crimeData
   a prov:Entity;
   prov:wasAttributedTo :government;
.
:government a foaf:Organization, prov:Agent .

:nationalRegionsList 
   a prov:Entity;
   prov:wasAttributedTo :civil_action_group;
.
:civil_action_group a foaf:Organization, prov:Agent .



// using curl to send a HTTP POST

cat provo-example.ttl | curl -H "Content-Type: text/turtle" -X POST -d @- http://localhost:43711/reveive-turtle

[npm-url]:https://www.npmjs.com/package/express-turtle-parser
