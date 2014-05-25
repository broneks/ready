<?php

include_once "mPDF/mpdf.php";

if ($_POST) {

	$mpdf = new mPDF();

	$html = $_POST['html'];
	$stylesheet = file_get_contents('templates.css');
	$title = rand(100, 10000) . '-Test.pdf';

	$mpdf->WriteHTML($stylesheet, 1);
	$mpdf->WriteHTML($html, 2);

	$mpdf->Output('files/' . $title);

	echo $title;
}