<?php
class DocController extends BaseController {

	private $pdfTitle = '-jobready-resume.pdf';

	//--- Convert HTML to PDF ---//

	public function postPDF() {
		$mpdf = new mPDF();

		$html = Input::get('html');
		$stylesheet = file_get_contents(public_path('css/templates.css'));

		$mpdf->WriteHTML($stylesheet, 1);
		$mpdf->WriteHTML($html, 2);

		$mpdf->Output(app_path('pdf') . '/' . Auth::user()['username'] . $this->pdfTitle);
	}

	//--- Download the PDF ---//

	public function getPDF() {
		return Response::download(app_path('pdf') . '/' . Auth::user()['username'] . $this->pdfTitle);
	}

	//--- Save a Document ---//

	public function postSaveDoc() {
		Doc::create(array(
			'user_id' 	  => Auth::User()['id'],
			'template_id' => Input::get('temp'),
			'title' 	  => e(Input::get('title')),
			'data' 		  => Input::get('data')
		));
	}

	//--- Retrieve a List of User's Saved Docs ---//

	public function getDocList() {
		$docs = Doc::where('user_id', '=', Auth::user()['id'])->get();

		$output = array();

		foreach ($docs as $doc) {
			$output[] = array(
				'id'      => $doc->id,
				'title'   => $doc->title,
				'created' => $doc->created_at->toDateTimeString()
			);
		}

		return Response::json($output);
	}

	//--- Display a Saved Doc ---//

	public function PostGetDoc() {
		$docId = Input::get('id');

		$doc = Doc::where('id', '=', $docId)->get()->first();

		// if the saved document belongs to the current user
		if ($doc->user_id === Auth::user()['id']) {
			$templateId = $doc->template_id;
			$t = Template::where('id', '=', $templateId)->get()->first();

			return Response::json(array(
				'templateId' => $templateId,
				'template'   => $t->template,
				'doc'        => $doc->data
			));
		}
		// else {
		// 	return Response::json(array('error' => 'An Unexpected Error Occurred. Please Try Again.', 'path' => '/app/resume-builder'), 500);
		// }
	}
}