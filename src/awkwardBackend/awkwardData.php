<?php

echo 'hello!<br/>';

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

var_dump($data);

echo realpath('./data/') . PHP_EOL;

if (!file_exists('./data/')) {
	echo 'Creating data folder...'.PHP_EOL;
	mkdir('./data/');
	echo 'Data folder created'.PHP_EOL;
} else {
	echo 'Data folder exists'.PHP_EOL;
}

$fname = $data->{'fname'}.'.csv';

echo 'filename: '.$fname;

echo $data->{'csvData'} . PHP_EOL;

echo 'Writing file' . PHP_EOL;

$myfile = fopen("./data/".$fname, "w") or die("Unable to open file!");
fwrite($myfile, $data->{'csvData'});
fclose($myfile);

echo 'goodbye!<br/>';

?>