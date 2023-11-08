<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://williambay.dev
 * @since      1.0.0
 *
 * @package    New_Media_Library
 * @subpackage New_Media_Library/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    New_Media_Library
 * @subpackage New_Media_Library/admin
 * @author     William Bay <william@williambay.com>
 */
class New_Media_Library_Admin {

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
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {


		$css_files = scandir( dirname( __FILE__ ) . '/new-media-library/build/static/css/');
		$react_css_to_load = '';
		foreach ( $css_files as $filename ) {
            if ( strpos( $filename, '.css' ) && ! strpos( $filename, '.css.map' ) ) {
				$react_css_to_load = plugin_dir_url( __FILE__ ) . 'new-media-library/build/static/css/' . $filename;
			}
		}
        wp_enqueue_style( 'new-media-library-css', $react_css_to_load, array(), $this->version, 'all' ); 

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/new-media-library-admin.css', array(), $this->version, 'all' );
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		$js_files = scandir( dirname( __FILE__ ) . '/new-media-library/build/static/js/');
		$react_js_to_load = '';
		foreach ( $js_files as $filename ) {

			if ( strpos( $filename, '.js' ) && ! strpos( $filename, '.js.map' ) && ! strpos( $filename, '.js.LICENSE.txt' )) {
				$react_js_to_load = plugin_dir_url( __FILE__ ) . 'new-media-library/build/static/js/' . $filename;
			}
		}
        wp_enqueue_script( 'new-media-library-js', $react_js_to_load, [], mt_rand( 10, 1000 ), true ); 
    
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/new-media-library-admin.js', array( 'jquery' ), $this->version, false );
        wp_localize_script( $this->plugin_name, 'new_media_library_scripts', array( 'currentSite' => get_bloginfo( 'url' ) ) );
	}

}


function wporg_options_page() {
    add_menu_page(
        'New Media Library',
        'New Media Library',
        'manage_options',
        'new-media-library',
        null,
        'dashicons-admin-media',
        5
    );
}
add_action( 'admin_menu', 'wporg_options_page' );

function add_root() {
	echo '<div id="root"></div>';
}
add_action( 'admin_head', 'add_root' );
