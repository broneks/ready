<?php
class TemplateController extends BaseController {

	public function getTemplates()
	{
		return Response::json(Template::get());
	}

}
