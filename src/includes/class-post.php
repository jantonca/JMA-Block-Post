<?php

class Post {

    // Properties
    public $title;
    public $link;
    public $excerpt;
    public $featuredImage;
    public $author;
    public $date;
    public $categories;
    public $tags; 

    function __construct( $post ) {

        $this->title = $post['title'];
        $this->link = $post['link'];
        $this->featured_image = $post['featured_image'];
        $this->excerpt = $post['excerpt'];
        $this->date = $post['date'];
        $this->categories = $post['categories'];
        $this->tags = $post['tags'];
        
    }

    // Methods
    public function get_title() {
        return $this->title;
    }

    public function get_link() {
        return $this->link;
    }

    public function get_excerpt() {
        return $this->excerpt;
    }

    public function get_featured_image_src() {
        return $this->featured_image['src'];
    }

    public function get_featured_image_caption() {
        return $this->featured_image['caption'];
    }

    public function display_image_post() {

        ob_start(); // Turn on output buffering

        /* BEGIN HTML OUTPUT */

        ?>

        <figure class="post-thumbnail">
            <a href="<?php echo $this->get_link(); ?>" rel="bookmark">
                <img src="<?php echo $this->get_featured_image_src(); ?>" } class="wp-post-image" alt="#" />
            </a>
        </figure>
        
        <?php

        /* END HTML OUTPUT */

        $output = ob_get_contents(); // collect output

        ob_end_clean(); // Turn off ouput buffer

        return $output; // Print output
    
    }

    public function get_date() {
        return $this->date;
    }

    public function get_author() {
        return $this->author;
    }

    public function get_categories() {
        return $this->categories;
    }

    public function get_tags() {
        return $this->tags;
    }

    public function display_post_date() {

        $date = date_create( $this->get_date() );

        ob_start(); // Turn on output buffering

        /* BEGIN HTML OUTPUT */

        ?>

        <span class="date"><?php echo date_format( $date, "j F Y" ); ?></span>      

        <?php

        /* END HTML OUTPUT */
        
        $output = ob_get_contents(); // collect output

        ob_end_clean(); // Turn off ouput buffer

        return $output; // Print output
    
    }

}