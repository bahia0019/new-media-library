<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://williambay.dev
 * @since      1.0.0
 *
 * @package    New_Media_Library
 * @subpackage New_Media_Library/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    New_Media_Library
 * @subpackage New_Media_Library/public
 * @author     William Bay <william@williambay.com>
 */
class New_Media_Library_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in New_Media_Library_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The New_Media_Library_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/new-media-library-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in New_Media_Library_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The New_Media_Library_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/new-media-library-public.js', array( 'jquery' ), $this->version, false );

	}

}



require_once plugin_dir_path( dirname( __FILE__ ) ) . '/includes/class-new-media-library-term-handler.php';

    /**
     * The "media_details" in the JSON API response (/wp-json/wp/v2/media) are stored
     * as a serialized string in the database so we can't use "meta_query" to filter it.
     *
     * Instead, let's add the extra data (like the aperture) as a taxonomy term.
     */

    add_filter('wp_generate_attachment_metadata', function ($metadata, $attachment_id) {
        
        $child_term_ids = [];
        // Get the aperture from the image meta data.

            if ( $aperture = $metadata['image_meta']['aperture'] ?? false ) {
                
                $child_term_id = MediaFilter\TermHandler::create( 'aperture', $aperture);
                $child_term_ids[] = $child_term_id; 
            }

            if ( $focal_length = $metadata['image_meta']['focal_length'] ?? false ) {

                $child_term_id = MediaFilter\TermHandler::create( 'focal_length', $focal_length);
                $child_term_ids[] = $child_term_id; 
            }

            
            if ( $camera = $metadata['image_meta']['camera'] ?? false ) {

                $child_term_id = MediaFilter\TermHandler::create( 'camera', $camera);
                $child_term_ids[] = $child_term_id; 
            }

        wp_set_object_terms($attachment_id, $child_term_ids, 'attachment_meta');

        return $metadata;
    }, 10, 2);

    /**
     * Add aperture filter to REST API query if the query param is set.
     *
     * Example: /wp-json/wp/v2/media?aperture=7.1
     * This will return all media with an aperture of 7.1 (assuming an image with that aperture exists).
     */
    add_filter('rest_attachment_query', function ($args, $request) {

            if ($aperture = $request->get_param( 'aperture' )) {
                $args['tax_query'] = [
                    [
                        'taxonomy' => 'attachment_meta',
                        'field'    => 'name',
                        'terms'    => $aperture,
                    ]
                ];
            } 
        return $args;
    }, 10, 2);


    add_filter('rest_attachment_query', function ($args, $request) {

        if ($focal_length = $request->get_param( 'focal_length' )) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'attachment_meta',
                    'field'    => 'name',
                    'terms'    => $focal_length,
                ]
            ];
        } 
        return $args;
    }, 10, 2);


    add_filter('rest_attachment_query', function ($args, $request) {
        if ($camera = $request->get_param( 'camera' )) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'attachment_meta',
                    'field'    => 'name',
                    'terms'    => $camera,
                ]
            ];
        } 

        return $args;
    }, 10, 2);


/**
 * Register the a custom taxonomy for the "attachment" post type.
 */
add_action('init', function () {
    register_taxonomy('attachment_meta', 'attachment', [
        'label'        => 'Attachment Meta',
        'public'       => true,
        'hierarchical' => true,
    ]);
});
