<?php
class Doc extends Eloquent {
	protected $fillable = array('user_id', 'template_id', 'title', 'data');
}