<?php
class TemplateController extends BaseController {

	private $title = '-jobready-resume.pdf';

	public function getTemplates() {
		return Response::json(Template::get());
	}

	public function postPDF() {
		$mpdf = new mPDF();

		$html = Input::get('html');
		$stylesheet = file_get_contents(public_path('css/templates.css'));

		$mpdf->WriteHTML($stylesheet, 1);
		$mpdf->WriteHTML($html, 2);

		$mpdf->Output(app_path('pdf') . '/' . Auth::user()['username'] . $this->title);
	}

	public function getPDF() {
		return Response::download(app_path('pdf') . '/' . Auth::user()['username'] . $this->title);
	}
}
