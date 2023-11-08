<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://williambay.dev
 * @since             1.0.0
 * @package           New_Media_Library
 *
 * @wordpress-plugin
 * Plugin Name:       New Media Library
 * Plugin URI:        https://williambay.dev
 * Description:       Attempt to build new Media Library for WordPress.
 * Version:           1.0.0
 * Author:            William Bay
 * Author URI:        https://williambay.dev/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       new-media-library
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'NEW_MEDIA_LIBRARY_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-new-media-library-activator.php
 */
function activate_new_media_library() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-new-media-library-activator.php';
	New_Media_Library_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-new-media-library-deactivator.php
 */
function deactivate_new_media_library() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-new-media-library-deactivator.php';
	New_Media_Library_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_new_media_library' );
register_deactivation_hook( __FILE__, 'deactivate_new_media_library' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-new-media-library.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_new_media_library() {

	$plugin = new New_Media_Library();
	$plugin->run();

}
run_new_media_library();
