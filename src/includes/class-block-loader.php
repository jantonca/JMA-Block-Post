<?php

class Classes_loader {
    /**
    * Constructor
    */
    public function __construct() {

        $this->loader();

        add_action( 'plugins_loaded', array( $this, 'load_plugin' ) );
    }
    public function loader() {
        require_once plugin_dir_path( __FILE__ ) . 'src/includes/class-block-helper.php';
    }
    /**
     * Loads plugin files.
     *
     * @since 1.0.0
     *
     * @return void
    */
    public function load_plugin() {
    }

}