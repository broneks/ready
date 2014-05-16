<?php
$oauth = new OAuth("", "");
$oauth->setToken("", "");

$method = OAUTH_HTTP_METHOD_GET;

$count = array("count" => 10);

$url = "http://api.linkedin.com/v1/people/~:(headline,first-name,last-name,positions,skills,educations)?format=json";

$oauth->fetch($url, $count, $method);

header('Content-Type: application/json');
echo $oauth->getLastResponse();
