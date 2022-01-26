<?php

class JMABlockPost {

    // Properties
    public $attributes;

    function __construct( $attributes ) {

        foreach ( $attributes as $attribute => $value ) {

            if ( $value !== '' ) {

                $this->$attribute = $value;

            }

        }
	}
	
	/**
	 * Add hooks and filters.
	 */
	public static function init() {
		add_action( 'after_setup_theme', [ __CLASS__, 'add_image_sizes' ] );
	}


    public function display_classes_container() {

        $classes_container = isset( $this->classesContainer ) ? $this->classesContainer : '';

        return $classes_container;

    }
    public function build_posts_query() {

        global $newspack_blocks_post_id;
		if ( ! $newspack_blocks_post_id ) {
			$newspack_blocks_post_id = array();
        }
        
        $authors             = isset( $this->authors ) ? $this->authors : array();
        $categories          = isset( $this->categories ) ? $this->categories : array();
        $categories_exclude  = isset( $this->categoriesExclude ) ? $this->categoriesExclude : array();
		$tags                = isset( $this->tags ) ? $this->tags : array();
		$tags_exclude        = isset( $this->tagsExclude ) ? $this->tagsExclude : array();
        $posts_amount        = intval( $this->postsAmount );
		$post_type           = isset( $this->postType ) ? $this->postType : 'post';
		$post_in             = isset( $this->page ) ? $this->page : array();
		$meta_key 			 = isset( $this->metaKey) ? $this->metaKey : '';
		$meta_value			 = isset( $this->metaValue) ? $this->metaValue : '';
		$orderby           	 = isset( $this->orderBy ) ? $this->orderBy : 'date';
		$order          	 = isset( $this->order ) ? $this->order : 'DESC';
		$args                = array(
			'post_status'         => 'publish',
			'suppress_filters'    => false,
			'ignore_sticky_posts' => true,
		);
        
        $args['post_type'] = $post_type;
        $args['posts_per_page'] = $posts_amount;

        if ( count( $newspack_blocks_post_id ) ) {
            $args['post__not_in'] = array_merge(
                $args['post__not_in'] ?? [],
                array_keys( $newspack_blocks_post_id )
            );
        }
        if ( $authors && count( $authors ) ) {
            $args['author__in'] = $authors;
        }
		if ( $post_in && count( $post_in ) ) {
            $args['post__in'] = $post_in;
        }
        if ( $categories && count( $categories ) ) {
            $args['category__in'] = $categories;
        }
        if ( $categories_exclude && count( $categories_exclude ) ) {
            $args['category__not_in'] = $categories_exclude;
        }
        if ( $tags && count( $tags ) ) {
            $args['tag__in'] = $tags;
        }
        if ( $tags_exclude && count( $tags_exclude ) ) {
            $args['tag__not_in'] = $tags_exclude;
		}
		if ( $meta_key && $meta_key !== '' ) {
            $args['meta_query'][]['key'] = $meta_key;
		}
		if ( $meta_value && $meta_value !== '' ) {
            $args['meta_query'][0]['value'] = $meta_value;
			$args['meta_query'][0]['compare'] = 'LIKE';
		}
		$args['orderby'] = $orderby;
        $args['order'] = $order;

        return $args;

    }

    /**
	 * This is a function from Newspack plugin. Loads a template with given data in scope.
	 *
	 * @param string $template full Path to the template to be included.
	 * @param array  $data          Data to be passed into the template to be included.
	 * @return string
	 */
	public static function template_inc( $template, $data = array() ) {
		if ( ! strpos( $template, '.php' ) ) {
			$template = $template . '.php';
		}
		if ( ! is_file( $template ) ) {
			return '';
		}
		ob_start();
		include $template;
		$contents = ob_get_contents();
		ob_end_clean();
		return $contents;
	}

	/**
	 * Prepare an array of authors, taking presence of CoAuthors Plus into account.
	 *
	 * @return array Array of WP_User objects.
	 */
	public static function display_authors() {
		if ( function_exists( 'coauthors_posts_links' ) ) {
			$authors = get_coauthors();
			foreach ( $authors as $author ) {
				// Check if this is a guest author post type.
				if ( 'guest-author' === get_post_type( $author->ID ) ) {
					// If yes, make sure the author actually has an avatar set; otherwise, coauthors_get_avatar returns a featured image.
					if ( get_post_thumbnail_id( $author->ID ) ) {
						$author->avatar = coauthors_get_avatar( $author, 48 );
					} else {
						// If there is no avatar, force it to return the current fallback image.
						$author->avatar = get_avatar( ' ' );
					}
				} else {
					$author->avatar = coauthors_get_avatar( $author, 48 );
				}
				$author->url = get_author_posts_url( $author->ID, $author->user_nicename );
			}
			return $authors;
		}
		$id = get_the_author_meta( 'ID' );
		return array(
			(object) array(
				'ID'            => $id,
				'avatar'        => get_avatar( $id, 48 ),
				'url'           => get_author_posts_url( $id ),
				'user_nicename' => get_the_author(),
				'display_name'  => get_the_author_meta( 'display_name' ),
			),
		);
    }
    
    	/**
	 * Prepare a list of classes based on assigned tags and categories.
	 *
	 * @param string $post_id Post ID.
	 * @return string CSS classes.
	 */
	public static function get_term_classes( $post_id ) {
		$classes = [];

		$tags = get_the_terms( $post_id, 'post_tag' );
		if ( ! empty( $tags ) ) {
			foreach ( $tags as $tag ) {
				$classes[] = 'tag-' . $tag->slug;
			}
		}

		$categories = get_the_terms( $post_id, 'category' );
		if ( ! empty( $categories ) ) {
			foreach ( $categories as $cat ) {
				$classes[] = 'category-' . $cat->slug;
			}
		}

		$post_format = get_post_format( $post_id );
		if ( false !== $post_format ) {
			$classes[] = 'format-' . $post_format;
		}

		$post_type = get_post_type( $post_id );
		if ( false !== $post_type ) {
			$classes[] = 'type-' . $post_type;
		}

		return implode( ' ', $classes );
	}

    /**
	 * Return the most appropriate thumbnail size to display.
	 *
	 * @param string $orientation The block's orientation settings: landscape|portrait|square.
	 *
	 * @return string Returns the thumbnail key to use.
	 */
	public static function image_size_for_orientation( $orientation = 'landscape' ) {
		$sizes = array(
			'landscape' => array(
				'large'  => array(
					1200,
					900,
				),
				'medium' => array(
					800,
					600,
				),
				'small'  => array(
					400,
					300,
				),
				'tiny'   => array(
					200,
					150,
				),
			),
			'portrait'  => array(
				'large'  => array(
					900,
					1200,
				),
				'medium' => array(
					600,
					800,
				),
				'small'  => array(
					300,
					400,
				),
				'tiny'   => array(
					150,
					200,
				),
			),
			'square'    => array(
				'large'  => array(
					1200,
					1200,
				),
				'medium' => array(
					800,
					800,
				),
				'small'  => array(
					400,
					400,
				),
				'tiny'   => array(
					200,
					200,
				),
			),
		);

		foreach ( $sizes[ $orientation ] as $key => $dimensions ) {
			$attachment = wp_get_attachment_image_src(
				get_post_thumbnail_id( get_the_ID() ),
				'newspack-article-block-' . $orientation . '-' . $key
			);
			if ( $dimensions[0] === $attachment[1] && $dimensions[1] === $attachment[2] ) {
				return 'newspack-article-block-' . $orientation . '-' . $key;
			}
		}

		return 'large';
	}
	    /**
	 * Return the most appropriate thumbnail size to display.
	 *
	 * @param string $orientation The block's orientation settings: landscape|portrait|square.
	 *
	 * @return string Returns the thumbnail key to use.
	 */
	public static function jma_custom_excerpt ( $excerptLength, $showExcerptMore, $excerptReadMore ) {

		$excerpt_raw = get_the_excerpt();
		$words_trim = $excerptLength;
		$more = '';
		if ( $showExcerptMore ) {
			$more = ' … <a href="'.get_permalink().'" class="">'.$excerptReadMore.'</a>';
		}
		$output = wp_trim_words( $excerpt_raw, $words_trim, $more );

		return $output;
	}

	/**
	 * Registers image sizes required for Newspack Blocks.
	 */
	public static function add_image_sizes() {
		add_image_size( 'newspack-article-block-landscape-large', 1200, 900, true );
		add_image_size( 'newspack-article-block-portrait-large', 900, 1200, true );
		add_image_size( 'newspack-article-block-square-large', 1200, 1200, true );

		add_image_size( 'newspack-article-block-landscape-medium', 800, 600, true );
		add_image_size( 'newspack-article-block-portrait-medium', 600, 800, true );
		add_image_size( 'newspack-article-block-square-medium', 800, 800, true );

		add_image_size( 'newspack-article-block-landscape-small', 400, 300, true );
		add_image_size( 'newspack-article-block-portrait-small', 300, 400, true );
		add_image_size( 'newspack-article-block-square-small', 400, 400, true );

		add_image_size( 'newspack-article-block-landscape-tiny', 200, 150, true );
		add_image_size( 'newspack-article-block-portrait-tiny', 150, 200, true );
		add_image_size( 'newspack-article-block-square-tiny', 200, 200, true );

		add_image_size( 'newspack-article-block-uncropped', 1200, 9999, false );
	}

}
JMABlockPost::init();