<?php
/**
 * WP_REST_Newspack_Articles_Controller file.
 *
 * @package WordPress
 */
/**
 * Class WP_REST_Newspack_Articles_Controller.
 */
class WP_REST_Intermedia_block_post extends WP_REST_Controller {
	/**
	 * Attribute schema.
	 *
	 * @var array
	 */
	public $attribute_schema;

	/**
	 * Constructs the controller.
	 *
	 * @access public
	 */
	public function __construct() {
		$this->namespace = 'intermedia-block-post/v1';
		$this->rest_base = 'articles';
	}
    /**
	 * Registers the necessary REST API routes.
	 *
	 * @access public
	 */
	public function register_routes() {

		// Endpoint to get articles on the front-end.
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'args'                => $this->get_attribute_schema(),
					'permission_callback' => '__return_true',
				],
			]
		);

		// Endpoint to get articles in the editor, in regular/query mode.
		register_rest_route(
			$this->namespace,
			'/intermedia-blocks-posts',
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ 'API_Block_Post', 'posts_endpoint' ],
				'args'                => [
					'author'         => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'integer',
						),
						'default' => array(),
					],
					'categories'     => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'integer',
						),
						'default' => array(),
					],
					'excerpt_length' => [
						'type'    => 'integer',
						'default' => 55,
					],
					'exclude'        => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'integer',
						),
						'default' => array(),
					],
					'include'        => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'integer',
						),
						'default' => array(),
					],
					'orderby'        => [
						'sanitize_callback' => 'sanitize_text_field',
					],
					'per_page'       => [
						'sanitize_callback' => 'absint',
					],
					'show_excerpt'   => [
						'type' => 'boolean',
					],
					'tags'           => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'integer',
						),
						'default' => array(),
					],
					'tags_exclude'   => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'integer',
						),
						'default' => array(),
					],
					'post_type'      => [
						'type'    => 'array',
						'items'   => array(
							'type' => 'string',
						),
						'default' => array(),
					],
				],
				'permission_callback' => '__return_true',
			]
		);

    }
	/**
	 * Sets up and returns attribute schema.
	 *
	 * @return array
	 */
	public function get_attribute_schema() {
		if ( empty( $this->attribute_schema ) ) {
			$block_json = json_decode(
				file_get_contents( __DIR__ . '/../block/block.json' ), // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
				true
			);

			$this->attribute_schema = array_merge(
				$block_json['attributes'],
				[
					'exclude_ids' => [
						'type'    => 'array',
						'default' => [],
						'items'   => [
							'type' => 'integer',
						],
					],
				]
			);
		}
		return $this->attribute_schema;
	}
}