<?php
/**
 * COS Tattoo Review Theme Settings Page
 *
 * @package Colorado_Springs_Tattoo_Review
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register settings page under Appearance menu.
 */
function coloradospringstattooreview_settings_menu() {
	add_theme_page(
		__( 'COS Review Settings', 'coloradospringstattooreview' ),
		__( 'COS Review Settings', 'coloradospringstattooreview' ),
		'manage_options',
		'cos-review-settings',
		'coloradospringstattooreview_settings_page_html'
	);
}
add_action( 'admin_menu', 'coloradospringstattooreview_settings_menu' );

/**
 * Register settings, sections, and fields.
 */
function coloradospringstattooreview_settings_init() {
	register_setting( 'cos_review_settings_group', 'cos_google_api_key', array(
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'default'           => '',
	) );

	register_setting( 'cos_review_settings_group', 'cos_yelp_api_key', array(
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'default'           => '',
	) );

	add_settings_section(
		'cos_api_keys_section',
		__( 'API Credentials Configuration', 'coloradospringstattooreview' ),
		'coloradospringstattooreview_section_desc',
		'cos-review-settings'
	);

	add_settings_field(
		'cos_google_api_key_field',
		__( 'Google Places API Key', 'coloradospringstattooreview' ),
		'coloradospringstattooreview_google_api_key_markup',
		'cos-review-settings',
		'cos_api_keys_section'
	);

	add_settings_field(
		'cos_yelp_api_key_field',
		__( 'Yelp Fusion API Key', 'coloradospringstattooreview' ),
		'coloradospringstattooreview_yelp_api_key_markup',
		'cos-review-settings',
		'cos_api_keys_section'
	);
}
add_action( 'admin_init', 'coloradospringstattooreview_settings_init' );

function coloradospringstattooreview_section_desc() {
	echo '<p>' . esc_html__( 'Configure the API keys below to enable automatic review fetching from Google and Yelp.', 'coloradospringstattooreview' ) . '</p>';
}

function coloradospringstattooreview_google_api_key_markup() {
	$value = get_option( 'cos_google_api_key', '' );
	echo '<input type="password" name="cos_google_api_key" value="' . esc_attr( $value ) . '" class="regular-text" />';
	echo '<p class="description">' . esc_html__( 'Required to retrieve reviews based on Google Place ID.', 'coloradospringstattooreview' ) . '</p>';
}

function coloradospringstattooreview_yelp_api_key_markup() {
	$value = get_option( 'cos_yelp_api_key', '' );
	echo '<input type="password" name="cos_yelp_api_key" value="' . esc_attr( $value ) . '" class="regular-text" />';
	echo '<p class="description">' . esc_html__( 'Required to retrieve reviews based on Yelp Business ID.', 'coloradospringstattooreview' ) . '</p>';
}

function coloradospringstattooreview_settings_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form action="options.php" method="post">
			<?php
			settings_fields( 'cos_review_settings_group' );
			do_settings_sections( 'cos-review-settings' );
			submit_button( __( 'Save API Settings', 'coloradospringstattooreview' ) );
			?>
		</form>
	</div>
	<?php
}
