<?php
/**
 * Register Newspack Blocks rest fields
 *
 * @package Newspack_Blocks
 */

/**
 * `Newspack_Blocks_API` is a wrapper for `register_rest_fields()`
 */
class API_Block_Post {

	/**
	 * Posts endpoint
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response.
	 */
	public static function posts_endpoint( $request ) {
		$params   = $request->get_params();
		$per_page = $request['per_page'];
		$post_type = $request['post_type'];
		$args     = [
			'post_type'           => $post_type,
			'post_status'         => 'publish',
			'posts_per_page'      => $per_page,
			'suppress_filters'    => false,
			'ignore_sticky_posts' => true,
			'has_password'        => false,
		];

		if ( $params['categories'] && count( $params['categories'] ) ) {
			$args['category__in'] = $params['categories'];
		}
		if ( $params['categories_exclude'] && count( $params['categories_exclude'] ) ) {
			$args['categories_exclude'] = $params['categories_exclude'];
		}
		if ( $params['tags'] && count( $params['tags'] ) ) {
			$args['tag__in'] = $params['tags'];
		}
		if ( $params['tags_exclude'] && count( $params['tags_exclude'] ) ) {
			$args['tag__not_in'] = $params['tags_exclude'];
		}
		if ( $params['author'] && count( $params['author'] ) ) {
			$args['author__in'] = $params['author'];
		}
		if ( $params['post_in'] ) {
			$args['post__in'] = $params['post_in'];
		}
		if ( $params['post_type'] && count( $params['post_type'] ) ) {
			$args['post_type'] = $params['post_type'];
		}
		if ( $params['metaKey'] ) {
			$args['meta_query'][0]['key'] = $params['metaKey'];
		}
		if ( $params['metaValue'] ) {
			$args['meta_query'][0]['value'] = $params['metaValue'];
		}
		if ( $params['metaCompare'] ) {
			$args['meta_query'][0]['compare'] = $params['metaCompare'];
		}
		if ( $params['order'] ) {
			$args['order'] = $params['order'];
		}

		$query        = new WP_Query();
		$query_result = $query->query( $args );
		$posts        = [];

		foreach ( $query_result as $post ) {
			$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
			setup_postdata( $post );

			$post_date_gmt = '0000-00-00 00:00:00' === $post->post_date_gmt ? get_gmt_from_date( $post->post_date ) : $post->post_date_gmt;

			// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound
			$excerpt = apply_filters( 'get_the_excerpt', $post->post_excerpt, $post );
			$excerpt = apply_filters( 'the_excerpt', $excerpt );
			$content = apply_filters( 'the_content', $post->post_content );
			// phpcs:enable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound

			$meta = new WP_REST_Post_Meta_Fields( 'post' );

			$data = [
				'author'         => (int) $post->post_author,
				'content'        => [
					'rendered' => post_password_required( $post ) ? '' : $content,
				],
				'date_gmt'       => mysql_to_rfc3339( $post_date_gmt ),
				'excerpt'        => [
					'rendered' => post_password_required( $post ) ? '' : $excerpt,
				],
				'featured_media' => (int) get_post_thumbnail_id( $post->ID ),
				'id'             => $post->ID,
				'post_type'		 => $post->post_type,
				'meta'           => $meta->get_value( $post->ID, $request ),
				'title'          => [
					'rendered' => get_the_title( $post->ID ),
				],
			];

            $add_ons = [
                'jma_featured_image_src'     => Block_helper::jma_blocks_get_image_src( $data ),
                'jma_featured_image_caption' => Block_helper::jma_blocks_get_image_caption( $data ),
                'jma_category_info'          => Block_helper::jma_blocks_get_primary_category( $data ),
                'jma_article_classes'        => Block_helper::jma_blocks_get_cat_tag_classes( $data['id'] ),
                'jma_author_info'            => Block_helper::jma_blocks_get_author_info( $data ),
            ];

			if ( $post->post_type === 'tribe_events' ) {
				$add_ons['jma_event_start_date'] = tribe_get_start_date( $post->ID, false, 'j F Y' );
			}

			$posts[] = array_merge( $data, $add_ons );
		}

		return new \WP_REST_Response( $posts );

	}

}