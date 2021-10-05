<?php

    function render_dynamic_intermedia_block_post( $attributes ) {

		//Initializing Block
        $block= new IntermediaBlockPost( $attributes );
		$article_query = new WP_Query( $block->build_posts_query() );
		
        /* BEGIN HTML OUTPUT */
        ob_start(); // Turn on output buffering

        if ( $article_query->have_posts() ) :

?>
		<div
			class="<?php echo esc_attr( $block->classesContainer ); ?>"
			>
			<div class="container-box" data-posts>
				<?php if ( isset( $block->titleSection ) ) : ?>
					<h2 class="article-section-title">
						<span><?php echo wp_kses_post( $block->titleSection ); ?></span>
					</h2>
				<?php endif; ?>
				<?php
				if( $block->postType !== 'page' ):
					echo IntermediaBlockPost::template_inc(
						__DIR__ . '/templates/articles-list.php',
						[
							'article_query'     => $article_query,
							'attributes'        => $block,
						]
					);
				endif;
				if( $block->postType === 'page' ):
					echo IntermediaBlockPost::template_inc(
						__DIR__ . '/templates/page.php',
						[
							'article_query'     => $article_query,
							'attributes'        => $block,
						]
					);
				endif;
				?>
			</div>

		</div>
<?php
        endif;
        /* END HTML OUTPUT */
        $output = ob_get_contents(); // collect output

        ob_end_clean(); // Turn off ouput buffer

        return $output; // Print output

    }

/**
 * Renders author avatar markup.
 *
 * @param array $author_info Author info array.
 *
 * @return string Returns formatted Avatar markup
 */
function display_avatars( $author_info ) {
	$elements = array_map(
		function ( $author ) {
			return sprintf( '<a href="%s">%s</a>', $author->url, $author->avatar );
		},
		$author_info
	);

	return implode( '', $elements );
}
/**
 * Renders byline markup.
 *
 * @param array $author_info Author info array.
 *
 * @return string Returns byline markup.
 */
function display_format_byline( $author_info ) {
	$index    = -1;
	$elements = array_merge(
		[
			esc_html_x( 'by', 'post author', 'newspack-blocks' ) . ' ',
		],
		array_reduce(
			$author_info,
			function ( $accumulator, $author ) use ( $author_info, &$index ) {
				$index ++;
				$penultimate = count( $author_info ) - 2;
				$get_author_posts_url = get_author_posts_url( $author->ID );
				if ( function_exists( 'coauthors_posts_links' ) ) {
					$get_author_posts_url = get_author_posts_url( $author->ID, $author->user_nicename );
				}

				return array_merge(
					$accumulator,
					[
						sprintf(
							/* translators: 1: author link. 2: author name. 3. variable seperator (comma, 'and', or empty) */
							'<span class="author vcard"><a class="url fn" href="%1$s">%2$s</a></span>',
							esc_url( $get_author_posts_url ),
							esc_html( $author->display_name ),
						),
						( $index < $penultimate ) ? ', ' : '',
						( count( $author_info ) > 1 && $penultimate === $index ) ? esc_html_x( ' and ', 'post author', 'newspack-blocks' ) : '',
					]
				);
			},
			[]
		)
	);

	return implode( '', $elements );
}