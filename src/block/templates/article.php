<?php
/**
 * Article template.
 *
 * @global array $attributes Block attributes.
 * @package WordPress
 */

call_user_func(
	function( $data ) {
		$attributes = $data['attributes'];
		$authors    = IntermediaBlockPost::display_authors();
		$classes    = array();
		$styles     = '';
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
        $category = false;
        $showCategory = isset( $attributes->displayCategory ) ? $attributes->displayCategory : false;

        $displaySponsoredContentBadge = isset( $attributes->displaySponsoredContentBadge ) ? $attributes->displaySponsoredContentBadge : false;

        $show_caption = isset( $attributes->displayCaption ) ? $attributes->displayCaption : false;

        $show_subtitle = isset( $attributes->displaySubtitle ) ? $attributes->displayCaption : false;

        $header_color = isset( $attributes->headerColor ) ? $attributes->headerColor : false;

        if ( $header_color ) {
            $header_color = 'has-'.$header_color.'-color"';
            $header_color_class = 'class="'.$header_color.'"';
        } else {
            $header_color = '';
            $header_color_class ='';
        }

        $custom_header_color = isset( $attributes->customHeaderColor ) ? $attributes->customHeaderColor : false;

        if ( $custom_header_color ) {
            $header_color_style = 'style="color:'.$custom_header_color.';"';
        } else {
            $header_color_style ='';
        }

        $text_color = isset( $attributes->textColor ) ? $attributes->textColor : false;

        if ( $text_color ) {
            $text_color = 'has-'.$text_color.'-color';
            $text_color_class = 'class="'.$text_color.'"';
        } else {
            $text_color = '';
            $text_color_class = '';
        }

        $custom_text_color = isset( $attributes->customTextColor ) ? $attributes->customTextColor : false;
        $excerpt_more_text = isset( $attributes->excerptReadMore ) ? $attributes->excerptReadMore : '';

        if ( $custom_text_color ) {
            $text_color_style = 'style="color:'.$custom_text_color.';"';
        } else {
            $text_color_style ='';
        }

		// Use Yoast primary category if set.
		if ( class_exists( 'WPSEO_Primary_Term' ) ) {
			$primary_term = new WPSEO_Primary_Term( 'category', get_the_ID() );
			$category_id  = $primary_term->get_primary_term();
			if ( $category_id ) {
				$category = get_term( $category_id );
			}
		}
		if ( ! $category ) {
			$categories_list = get_the_category();
			if ( ! empty( $categories_list ) ) {
				$category = $categories_list[0];
			}
		}
        
        ?>

        <article data-post-id="<?php the_id(); ?>"
            class="<?php echo esc_attr( implode( ' ', $classes ) ); ?>"
            <?php if ( $styles ) : ?>
            style="<?php echo esc_attr( $styles ); ?>"
            <?php endif; ?>
            >
            <?php if ( has_post_thumbnail() && $attributes->displayFeaturedImage && $attributes->imageShape ) : ?>
                <figure class="post-thumbnail <?php echo $text_color; ?>">
                    <a href="<?php the_permalink(); ?>" rel="bookmark">
                    <?php the_post_thumbnail( $image_size, $thumbnail_args ); ?>
                    </a>
    
                    <?php if ( $show_caption && '' !== get_the_post_thumbnail_caption() ) : ?>
                        <figcaption><?php the_post_thumbnail_caption(); ?></figcaption>
                    <?php endif; ?>
                </figure><!-- .featured-image -->
            <?php endif; ?>
    
            <div class="entry-wrapper">
                <?php if ( $displaySponsoredContentBadge && get_post_type( get_the_ID() ) === 'sponsored_content' ) : ?>
                    <div class="sponsored-content-badge" >
						<span><?php echo $attributes->sponsoredContentBadgeMessage ?></span>
					</div>
                <?php endif; ?>
                <?php if ( $showCategory && $category ) : ?>
                    <div class="cat-links <?php echo $text_color; ?>" <?php echo $text_color_style; ?>>
                        <a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>">
                            <?php echo esc_html( $category->name ); ?>
                        </a>
                    </div>
                    <?php
                endif;
    
                if ( isset( $attributes->titleSection ) ) :
                    the_title( '<h2 class="entry-title '.$header_color.'"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark" '.$header_color_style.' >', '</a></h2>' );
                else :
                    the_title( '<h3 class="entry-title '.$header_color.'"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark" '.$header_color_style.' >', '</a></h3>' );
                endif;
                ?>
                <?php
                if ( $show_subtitle ) : ?>

                    <div class="newspack-post-subtitle newspack-post-subtitle--in-homepage-block <?php echo $text_color; ?>">
                        <?php echo esc_html( get_post_meta( get_the_ID(), 'newspack_post_subtitle', true ) ); ?>
                    </div>

                <?php endif; ?>
                <?php
                if ( $attributes->displayExcerpt ) : ?>

                    <p <?php echo $text_color_class; ?> <?php echo $text_color_style; ?> ><?php echo IntermediaBlockPost::intermedia_custom_excerpt( $attributes->excerptLength, $attributes->displayExcerptMore, $excerpt_more_text ); ?></p>

                <?php endif;
                if ( $attributes->displayAuthor || $attributes->displayDate ) :
                    ?>
                    <div class="entry-meta <?php echo $text_color; ?>" <?php echo $text_color_style; ?> >
                        <?php
                        if ( $attributes->displayAuthor ) :
                            if ( $attributes->displayAuthorAvatar ) :
                                echo wp_kses(
                                    display_avatars( $authors ),
                                    array(
                                        'img'      => array(
                                            'class'  => true,
                                            'src'    => true,
                                            'alt'    => true,
                                            'width'  => true,
                                            'height' => true,
                                            'data-*' => true,
                                            'srcset' => true,
                                        ),
                                        'noscript' => array(),
                                        'a'        => array(
                                            'href' => true,
                                        ),
                                    )
                                );
                            endif;
                            ?>
                            <span class="byline">
                                <?php echo wp_kses_post( display_format_byline( $authors ) ); ?>
                            </span><!-- .author-name -->
                            <?php
                        endif;
                        if ( $attributes->displayDate ) :
                            $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
                            if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) :
                                $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
                            endif;
                            printf(
                                wp_kses(
                                    $time_string,
                                    array(
                                        'time' => array(
                                            'class'    => true,
                                            'datetime' => true,
                                        ),
                                    )
                                ),
                                esc_attr( get_the_date( DATE_W3C ) ),
                                esc_html( get_the_date() ),
                                esc_attr( get_the_modified_date( DATE_W3C ) ),
                                esc_html( get_the_modified_date() )
                            );
                        endif;
                        ?>
                    </div><!-- .entry-meta -->
                <?php endif; ?>
                <?php if ( get_post_type( get_the_ID() ) === 'sponsored_content' ):

                    $repeatable_fields = get_post_meta( get_the_ID(), 'intermedia_sponsored_content', true );

                ?>
                    <div class="sponsored-content">
                        <small><?php echo $attributes->sponsoredContentMessage ?> <span><strong><?php echo  $repeatable_fields[0]['name']; ?></strong></span></small>
                    </div>
                <?php endif; ?>
            </div><!-- .entry-wrapper -->
        </article>
    
            <?php

	},
	$data // phpcs:ignore VariableAnalysis.CodeAnalysis.VariableAnalysis.UndefinedVariable
);