<?php
/**
 * Plugin Name: JMA Block Post — JMA Gutenberg Block Plugin for displaying Posts
 * Plugin URI: https://jma.com.au
 * Description: This is a plugin for displaying posts and CPT in WordPress templates using a Gutenberg custom block.
 * Author: Jose Anton
 * Author URI: https://jma.com.au
 * Version: 1.4.2
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
/**
 * The core plugin classes
 */
require_once plugin_dir_path( __FILE__ ) . 'src/includes/class-block-helper.php';
// phpcs:ignore require plugin_dir_path( __FILE__ ) . '/src/includes/class-post.php';
require_once plugin_dir_path( __FILE__ ) . '/src/includes/class-block.php';
require plugin_dir_path( __FILE__ ) . '/src/includes/class-api-block-post.php';
// REST Controller for Articles Block.
require_once plugin_dir_path( __FILE__ ) . '/src/includes/class-wp-rest-jma-block-post-controller.php';
/**
 * Registers Articles block routes.
 */
function jma_block_post_register_rest_routes() { // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedFunctionFound
	$articles_controller = new WP_REST_JMA_block_post();
	$articles_controller->register_routes();
}
add_action( 'rest_api_init', 'jma_block_post_register_rest_routes' );