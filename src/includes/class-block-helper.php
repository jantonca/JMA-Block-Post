<?php
/**
 * Plugin helper class
 *
 * 
 *
 * @since
 * @package
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
class Block_helper {

    /**
    * Get Post Types.
    *
    * @since 1.11.0
    * @access public
    */
    public static function get_post_types() {

        $post_types = get_post_types(
            array(
                'public'       => true,
            ),
            'objects'
        );
        $options = array();
		if ( class_exists( 'Tribe__Events__Main' ) ) {
			$options[] = array(
				'value' => 'tribe_events',
				'label' => 'The Events Calendar',
			);
		}
        foreach ( $post_types as $post_type ) {

            if ( 'product' === $post_type->name ) {
                continue;
            }

            if ( 'attachment' === $post_type->name ) {
                continue;
            }

			if ( 'ai1ec_event' === $post_type->name ) {
				$options[] = array(
					'value' => $post_type->name,
					'label' => 'All in One Event',
				);
				continue;
            }

            $options[] = array(
                'value' => $post_type->name,
                'label' => $post_type->label,
            );
        }

        return apply_filters( 'intermedia_post_types', $options );

    }

    /**
	 * Get thumbnail featured image source for the rest field.
	 *
	 * @param array $object The object info.
	 * @return array | bool Featured image if available, false if not.
	 */
	public static function intermedia_blocks_get_image_src( $object ) {

		$featured_image_set = [];

		if ( 0 === $object['featured_media'] ) {
			return false;
		}

		// Large image.
		$feat_img_array_large = wp_get_attachment_image_src(
			$object['featured_media'],
			'large',
			false
		);
		$featured_image_set['large'] = $feat_img_array_large[0];

		// Landscape image.
		$landscape_size = IntermediaBlockPost::image_size_for_orientation( 'landscape' );
		$feat_img_array_landscape = wp_get_attachment_image_src(
			$object['featured_media'],
			$landscape_size,
			false
		);
		$featured_image_set['landscape'] = $feat_img_array_landscape[0];

		// Portrait image.
		$portrait_size = IntermediaBlockPost::image_size_for_orientation( 'portrait' );
		$feat_img_array_portrait = wp_get_attachment_image_src(
			$object['featured_media'],
			$portrait_size,
			false
		);
		$featured_image_set['portrait'] = $feat_img_array_portrait[0];

		// Square image.
		$square_size = IntermediaBlockPost::image_size_for_orientation( 'square' );
		$feat_img_array_square = wp_get_attachment_image_src(
			$object['featured_media'],
			$square_size,
			false
		);
		$featured_image_set['square'] = $feat_img_array_square[0];

		// Uncropped image.
		$uncropped_size = 'newspack-article-block-uncropped';
		$feat_img_array_uncropped = wp_get_attachment_image_src(
			$object['featured_media'],
			$uncropped_size,
			false
		);
        $featured_image_set['uncropped'] = $feat_img_array_uncropped[0];
        
        return $featured_image_set;
        
	}
    
	/**
	 * Get thumbnail featured image captions for the rest field.
	 *
	 * @param array $object The object info.
	 * @return string|null Image caption on success, null on failure.
	 */
	public static function intermedia_blocks_get_image_caption( $object ) {
		return (int) $object['featured_media'] > 0 ? trim( wp_get_attachment_caption( $object['featured_media'] ) ) : null;
	}

    /**
	 * Get author info for the rest field.
	 *
	 * @param array $object The object info.
	 * @return array Author data.
	 */
	public static function intermedia_blocks_get_author_info( $object ) {
		$author_data = [];

		if ( function_exists( 'coauthors_posts_links' ) && ! empty( get_coauthors() ) ) :
			$authors = get_coauthors();

			foreach ( $authors as $author ) {
				// Check if this is a guest author post type.
				if ( 'guest-author' === get_post_type( intval( $author->ID ) ) ) {
					// If yes, make sure the author actually has an avatar set; otherwise, coauthors_get_avatar returns a featured image.
					if ( get_post_thumbnail_id( intval( $author->ID ) ) ) {
						$author_avatar = coauthors_get_avatar( $author, 48 );
					} else {
						// If there is no avatar, force it to return the current fallback image.
						$author_avatar = get_avatar( ' ' );
					}
				} else {
					$author_avatar = coauthors_get_avatar( $author, 48 );
				}
				$author_link = null;
				if ( function_exists( 'coauthors_posts_links' ) ) {
					$author_link = get_author_posts_url( intval( $author->ID ), $author->user_nicename );
				}
				$author_data[] = array(
					/* Get the author name */
					'display_name' => esc_html( $author->display_name ),
					/* Get the author avatar */
					'avatar'       => wp_kses_post( $author_avatar ),
					/* Get the author ID */
					'id'           => intval( $author->ID ),
					/* Get the author Link */
					'author_link'  => $author_link,
				);
			}
		else :
			$author_data[] = array(
				/* Get the author name */
				'display_name' => get_the_author_meta( 'display_name', $object['author'] ),
				/* Get the author avatar */
				'avatar'       => get_avatar( $object['author'], 48 ),
				/* Get the author ID */
				'id'           => $object['author'],
				/* Get the author Link */
				'author_link'  => get_author_posts_url( $object['author'] ),
			);
		endif;

		/* Return the author data */
		return $author_data;
    }
    
    /**
	 * Get primary category for the rest field.
	 *
	 * @param array $object The object info.
	 * @return string Category name.
	 */
	public static function intermedia_blocks_get_primary_category( $object ) {
		$category = false;

		// Use Yoast primary category if set.
		if ( class_exists( 'WPSEO_Primary_Term' ) ) {
			$primary_term = new WPSEO_Primary_Term( 'category', $object['id'] );
			$category_id = $primary_term->get_primary_term();
			if ( $category_id ) {
				$category = get_term( $category_id );
			}
		}

		if ( ! $category ) {
			$categories_list = get_the_category( $object['id'] );
			if ( ! empty( $categories_list ) ) {
				$category = $categories_list[0];
			}
		}

		if ( ! $category ) {
			return 1;
		}

		return $category->name;
    }
    
    /**
	 * Get a list of category, tag classes for the rest field.
	 *
	 * @param array $object The object info.
	 * @return string classes from assigned categories and tags.
	 */
	public static function intermedia_blocks_get_cat_tag_classes( $object ) {
		return IntermediaBlockPost::get_term_classes( $object['id'] );
	}

}