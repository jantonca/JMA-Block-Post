<?php
/**
 * Page template.
 *
 * @global array $attributes Block attributes.
 * @package WordPress
 */
call_user_func(
	function( $data ) {
		//var_dump($data['attributes']);
		global $wp_query;
		$main_query = $wp_query;
        wp_reset_postdata();
        $attributes    = $data['attributes'];
		$article_query = $data['article_query'];
		$wp_query = $article_query; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		global $newspack_blocks_post_id;
		$post_counter = 0;
		$template_name = isset( $attributes->template ) ? '-'.$attributes->template : '';
		//$template_name = '-'.$attributes->className;
		if ( $template_name === '-is-style-default' ) {
			$template_name = '';
		}
		//var_dump($attributes);
		while ( $article_query->have_posts() ) {

			$article_query->the_post();
			$newspack_blocks_post_id[ get_the_ID() ] = true;
            $post_counter++;
            $classes = array();
            $styles = '';
            // Add classes based on the post's assigned categories and tags.
            $classes[] = IntermediaBlockPost::get_term_classes( get_the_ID() );
    
            // Add classes from attributes
            $classes[] = $attributes->classesArticle;
            
            // Add class if post has a featured image.
            if ( has_post_thumbnail() ) {
                $classes[] = 'post-has-image';
            }
            
            if ( 'behind' === $attributes->imageAlignment && $attributes->displayFeaturedImage && has_post_thumbnail() ) {
                $styles = 'min-height: ' . $attributes->articleMinHeight . 'vh; padding-top: ' . ( $attributes->articleMinHeight / 5 ) . 'vh;';
            }
            $image_size = 'newspack-article-block-uncropped';
            if ( has_post_thumbnail() && 'uncropped' !== $attributes->imageShape ) {
                $image_size = IntermediaBlockPost::image_size_for_orientation( $attributes->imageShape );
            }
            $thumbnail_args = '';
            // If the image position is behind, pass the object-fit setting to maintain styles with AMP.
            if ( 'behind' === $attributes->imageAlignment ) {
                $thumbnail_args = array( 'object-fit' => 'cover' );
            }
            ?>
                <article data-post-id="<?php the_id(); ?>"
                    class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>"
                    >
                    <?php if ( has_post_thumbnail() && $attributes->displayPageFeaturedImage && $attributes->imageShape ) : ?>
                        <figure class="post-thumbnail">
                            <a href="<?php the_permalink(); ?>" rel="bookmark">
                                <?php the_post_thumbnail( $image_size, $thumbnail_args ); ?>
                            </a>
            
                            <?php if ( $attributes->displayCaption && '' !== get_the_post_thumbnail_caption() ) : ?>
                                <figcaption ><?php the_post_thumbnail_caption(); ?></figcaption>
                            <?php endif; ?>
                        </figure><!-- .featured-image -->
                    <?php endif; ?>
                    <div class="entry-wrapper">
                        <?php if ( $attributes->displayPageTitle ) : ?>
                            <?php 
                                if ( isset( $attributes->titleSection ) ) :
                                    the_title( '<h2 class="entry-title '.$header_color.'"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark" '.$header_color_style.' >', '</a></h2>' );
                                else :
                                    the_title( '<h3 class="entry-title '.$header_color.'"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark" '.$header_color_style.' >', '</a></h3>' );
                                endif;
                            ?>
                        <?php endif; ?>
                        <?php if ( $attributes->displayPageContent ) : ?>
                            <?php the_content(); ?>
                        <?php endif; ?>
                    </div>
                </article>
            <?php
		}
		$wp_query = $main_query; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		wp_reset_postdata();
	},
	$data // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
);