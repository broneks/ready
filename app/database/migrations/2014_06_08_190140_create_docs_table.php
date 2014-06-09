<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDocsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('docs', function($table) {
			$table->increments('id');
			$table->integer('user_id')->unsigned();
			$table->integer('template_id')->unsigned();
			$table->foreign('user_id')->references('id')->on('users');
			$table->foreign('template_id')->references('id')->on('templates');
			$table->string('title', 30);
			$table->text('data');
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('docs');
	}

}
