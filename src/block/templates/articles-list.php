<?php
/**
 * Article list template.
 *
 * @global WP_Query $article_query Article query.
 * @global array    $attributes
 * @package WordPress
 */

call_user_func(
	function( $data ) {
		echo IntermediaBlockPost::template_inc( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			__DIR__ . '/articles-loop.php',
			$data
		);
	},
	$data // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
);