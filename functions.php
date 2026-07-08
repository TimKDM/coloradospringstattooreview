<?php
/**
 * Colorado Springs Tattoo Review functions and definitions
 *
 * @package Colorado_Springs_Tattoo_Review
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Include theme admin settings page.
require_once get_template_directory() . '/admin-settings.php';

/**
 * Setup theme support and features.
 */
function coloradospringstattooreview_setup() {
	// Add default RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	// Let WordPress manage the document title.
	add_theme_support( 'title-tag' );

	// Enable support for Post Thumbnails on posts and pages.
	add_theme_support( 'post-thumbnails' );

	// Switch default core markup for search form, comment form, and comments to output valid HTML5.
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
}
add_action( 'after_setup_theme', 'coloradospringstattooreview_setup' );

/**
 * Enqueue scripts and styles.
 */
function coloradospringstattooreview_scripts() {
	// Enqueue the main stylesheet.
	wp_enqueue_style( 'coloradospringstattooreview-style', get_stylesheet_uri(), array(), '1.0.0' );
	
	// Enqueue a Google Font (Outfit) for premium typography.
	wp_enqueue_style( 'coloradospringstattooreview-google-fonts', 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap', array(), null );
}
add_action( 'wp_enqueue_scripts', 'coloradospringstattooreview_scripts' );

/**
 * Register Custom Post Type: Tattoo Shops
 */
function coloradospringstattooreview_register_tattoo_shops() {
	$labels = array(
		'name'                  => _x( 'Tattoo Shops', 'Post Type General Name', 'coloradospringstattooreview' ),
		'singular_name'         => _x( 'Tattoo Shop', 'Post Type Singular Name', 'coloradospringstattooreview' ),
		'menu_name'             => __( 'Tattoo Shops', 'coloradospringstattooreview' ),
		'name_admin_bar'        => __( 'Tattoo Shop', 'coloradospringstattooreview' ),
		'archives'              => __( 'Shop Archives', 'coloradospringstattooreview' ),
		'attributes'            => __( 'Shop Attributes', 'coloradospringstattooreview' ),
		'parent_item_colon'     => __( 'Parent Shop:', 'coloradospringstattooreview' ),
		'all_items'             => __( 'All Shops', 'coloradospringstattooreview' ),
		'add_new_item'          => __( 'Add New Tattoo Shop', 'coloradospringstattooreview' ),
		'add_new'               => __( 'Add New', 'coloradospringstattooreview' ),
		'new_item'              => __( 'New Tattoo Shop', 'coloradospringstattooreview' ),
		'edit_item'             => __( 'Edit Tattoo Shop', 'coloradospringstattooreview' ),
		'update_item'           => __( 'Update Tattoo Shop', 'coloradospringstattooreview' ),
		'view_item'             => __( 'View Tattoo Shop', 'coloradospringstattooreview' ),
		'view_items'            => __( 'View Shops', 'coloradospringstattooreview' ),
		'search_items'          => __( 'Search Shop', 'coloradospringstattooreview' ),
		'not_found'             => __( 'Not found', 'coloradospringstattooreview' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'coloradospringstattooreview' ),
		'featured_image'        => __( 'Shop Image / Logo', 'coloradospringstattooreview' ),
		'set_featured_image'    => __( 'Set shop image', 'coloradospringstattooreview' ),
		'remove_featured_image' => __( 'Remove shop image', 'coloradospringstattooreview' ),
		'use_featured_image'    => __( 'Use as shop image', 'coloradospringstattooreview' ),
		'insert_into_item'      => __( 'Insert into shop', 'coloradospringstattooreview' ),
		'uploaded_to_this_item' => __( 'Uploaded to this shop', 'coloradospringstattooreview' ),
		'items_list'            => __( 'Shops list', 'coloradospringstattooreview' ),
		'items_list_navigation' => __( 'Shops list navigation', 'coloradospringstattooreview' ),
		'filter_items_list'     => __( 'Filter shops list', 'coloradospringstattooreview' ),
	);
	
	$args = array(
		'label'                 => __( 'Tattoo Shop', 'coloradospringstattooreview' ),
		'description'           => __( 'Custom post type for local tattoo shops in Colorado Springs', 'coloradospringstattooreview' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions' ),
		'taxonomies'            => array(),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'menu_icon'             => 'dashicons-art', // WordPress admin icon representing art
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'show_in_rest'          => true, // Enables Gutenberg editor support
		'rewrite'               => array( 'slug' => 'tattoo-shops' ),
	);
	
	register_post_type( 'tattoo_shops', $args );
}
add_action( 'init', 'coloradospringstattooreview_register_tattoo_shops', 0 );

/**
 * Register Shop Custom Fields Metabox
 */
function coloradospringstattooreview_add_shop_metabox() {
	add_meta_box(
		'coloradospringstattooreview_shop_meta',
		__( 'Tattoo Shop Information & Reviews', 'coloradospringstattooreview' ),
		'coloradospringstattooreview_render_shop_metabox',
		'tattoo_shops',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'coloradospringstattooreview_add_shop_metabox' );

/**
 * Render Shop Custom Fields Metabox HTML
 */
function coloradospringstattooreview_render_shop_metabox( $post ) {
	// Add nonce for security
	wp_nonce_field( 'coloradospringstattooreview_save_shop_meta', 'coloradospringstattooreview_shop_meta_nonce' );

	// Retrieve existing metadata
	$rating         = get_post_meta( $post->ID, '_tattoo_shop_rating', true );
	$price_range    = get_post_meta( $post->ID, '_tattoo_shop_price_range', true );
	$address        = get_post_meta( $post->ID, '_tattoo_shop_address', true );
	$phone          = get_post_meta( $post->ID, '_tattoo_shop_phone', true );
	$website        = get_post_meta( $post->ID, '_tattoo_shop_website', true );
	$hours          = get_post_meta( $post->ID, '_tattoo_shop_hours', true );
	$google_id      = get_post_meta( $post->ID, '_tattoo_shop_google_place_id', true );
	$yelp_id        = get_post_meta( $post->ID, '_tattoo_shop_yelp_business_id', true );
	$manual_reviews = get_post_meta( $post->ID, '_tattoo_shop_manual_reviews', true );

	if ( ! is_array( $manual_reviews ) ) {
		$manual_reviews = array();
	}
	?>
	<style>
		.cos-meta-row { display: flex; margin-bottom: 15px; align-items: flex-start; }
		.cos-meta-label { width: 180px; font-weight: bold; padding-top: 5px; }
		.cos-meta-input { flex: 1; }
		.cos-meta-input input[type="text"], .cos-meta-input textarea, .cos-meta-input select { width: 100%; max-width: 500px; }
		.cos-reviews-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
		.cos-reviews-table th, .cos-reviews-table td { text-align: left; padding: 8px; border: 1px solid #ddd; }
		.cos-reviews-table th { background-color: #f5f5f5; }
		.cos-btn-add { margin-top: 10px; }
	</style>

	<div style="padding: 10px 0;">
		<!-- Standard Fields -->
		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_rating"><?php esc_html_e( 'Manual Shop Rating (0.0 - 5.0)', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input"><input type="text" id="shop_rating" name="shop_rating" value="<?php echo esc_attr( $rating ); ?>" style="width: 100px;" placeholder="e.g. 4.8" /></div>
		</div>

		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_price_range"><?php esc_html_e( 'Price Range', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input">
				<select id="shop_price_range" name="shop_price_range" style="width: 100px;">
					<option value="" <?php selected( $price_range, '' ); ?>>- Select -</option>
					<option value="$" <?php selected( $price_range, '$' ); ?>>$</option>
					<option value="$$" <?php selected( $price_range, '$$' ); ?>>$$</option>
					<option value="$$$" <?php selected( $price_range, '$$$' ); ?>>$$$</option>
					<option value="$$$$" <?php selected( $price_range, '$$$$' ); ?>>$$$$</option>
				</select>
			</div>
		</div>

		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_address"><?php esc_html_e( 'Address', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input"><input type="text" id="shop_address" name="shop_address" value="<?php echo esc_attr( $address ); ?>" /></div>
		</div>

		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_phone"><?php esc_html_e( 'Phone Number', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input"><input type="text" id="shop_phone" name="shop_phone" value="<?php echo esc_attr( $phone ); ?>" placeholder="e.g. (719) 555-0199" /></div>
		</div>

		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_website"><?php esc_html_e( 'Website URL', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input"><input type="text" id="shop_website" name="shop_website" value="<?php echo esc_url( $website ); ?>" placeholder="e.g. https://studio.com" /></div>
		</div>

		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_hours"><?php esc_html_e( 'Hours', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input"><textarea id="shop_hours" name="shop_hours" rows="3"><?php echo esc_textarea( $hours ); ?></textarea></div>
		</div>

		<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />

		<!-- Automated Sync Fields -->
		<h3><?php esc_html_e( 'API Integration & Automated Review Sync', 'coloradospringstattooreview' ); ?></h3>
		<p class="description"><?php esc_html_e( 'Enter Google Place ID below. The theme will fetch the latest reviews from Google upon saving if changed or after 24 hours.', 'coloradospringstattooreview' ); ?></p>
		<br/>

		<div class="cos-meta-row">
			<div class="cos-meta-label"><label for="shop_google_place_id"><?php esc_html_e( 'Google Place ID', 'coloradospringstattooreview' ); ?></label></div>
			<div class="cos-meta-input">
				<input type="text" id="shop_google_place_id" name="shop_google_place_id" value="<?php echo esc_attr( $google_id ); ?>" placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83VSY4" />
				<p class="description"><a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Find Google Place ID', 'coloradospringstattooreview' ); ?> ↗</a></p>
			</div>
		</div>

		<hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />

		<!-- Manual Reviews Section -->
		<h3><?php esc_html_e( 'Featured & Manual Reviews', 'coloradospringstattooreview' ); ?></h3>
		<p class="description"><?php esc_html_e( 'Manually add customer reviews from other platforms or direct testimonials. They will be merged with the automatically synced reviews.', 'coloradospringstattooreview' ); ?></p>
		
		<table class="cos-reviews-table" id="cos_manual_reviews_table">
			<thead>
				<tr>
					<th><?php esc_html_e( 'Reviewer Name', 'coloradospringstattooreview' ); ?></th>
					<th><?php esc_html_e( 'Platform', 'coloradospringstattooreview' ); ?></th>
					<th><?php esc_html_e( 'Rating', 'coloradospringstattooreview' ); ?></th>
					<th><?php esc_html_e( 'Review Content', 'coloradospringstattooreview' ); ?></th>
					<th><?php esc_html_e( 'Date', 'coloradospringstattooreview' ); ?></th>
					<th><?php esc_html_e( 'Action', 'coloradospringstattooreview' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $manual_reviews as $index => $review ) : ?>
					<tr>
						<td><input type="text" name="manual_reviews[<?php echo $index; ?>][author]" value="<?php echo esc_attr( $review['author'] ); ?>" required /></td>
						<td>
							<select name="manual_reviews[<?php echo $index; ?>][platform]">
								<option value="google" <?php selected( $review['platform'], 'google' ); ?>>Google</option>
								<option value="yelp" <?php selected( $review['platform'], 'yelp' ); ?>>Yelp</option>
								<option value="facebook" <?php selected( $review['platform'], 'facebook' ); ?>>Facebook</option>
								<option value="direct" <?php selected( $review['platform'], 'direct' ); ?>>Direct / Website</option>
							</select>
						</td>
						<td>
							<select name="manual_reviews[<?php echo $index; ?>][rating]">
								<option value="5" <?php selected( $review['rating'], 5 ); ?>>5 Stars</option>
								<option value="4" <?php selected( $review['rating'], 4 ); ?>>4 Stars</option>
								<option value="3" <?php selected( $review['rating'], 3 ); ?>>3 Stars</option>
								<option value="2" <?php selected( $review['rating'], 2 ); ?>>2 Stars</option>
								<option value="1" <?php selected( $review['rating'], 1 ); ?>>1 Star</option>
							</select>
						</td>
						<td><textarea name="manual_reviews[<?php echo $index; ?>][text]" rows="2" style="width: 100%; min-width: 200px;"><?php echo esc_textarea( $review['text'] ); ?></textarea></td>
						<td><input type="text" name="manual_reviews[<?php echo $index; ?>][date]" value="<?php echo esc_attr( $review['date'] ); ?>" placeholder="YYYY-MM-DD" style="width: 100px;" /></td>
						<td><button type="button" class="button button-link-delete cos-btn-remove"><?php esc_html_e( 'Delete', 'coloradospringstattooreview' ); ?></button></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		<button type="button" class="button button-primary cos-btn-add" id="cos_add_review_row"><?php esc_html_e( 'Add Review Row', 'coloradospringstattooreview' ); ?></button>
	</div>

	<script>
		document.addEventListener('DOMContentLoaded', function() {
			var tableBody = document.querySelector('#cos_manual_reviews_table tbody');
			var addButton = document.getElementById('cos_add_review_row');
			var rowCount = <?php echo count( $manual_reviews ); ?>;

			addButton.addEventListener('click', function(e) {
				e.preventDefault();
				var newRow = document.createElement('tr');
				newRow.innerHTML = 
					'<td><input type="text" name="manual_reviews[' + rowCount + '][author]" value="" required /></td>' +
					'<td>' +
						'<select name="manual_reviews[' + rowCount + '][platform]">' +
							'<option value="google">Google</option>' +
							'<option value="yelp">Yelp</option>' +
							'<option value="facebook">Facebook</option>' +
							'<option value="direct">Direct / Website</option>' +
						'</select>' +
					'</td>' +
					'<td>' +
						'<select name="manual_reviews[' + rowCount + '][rating]">' +
							'<option value="5">5 Stars</option>' +
							'<option value="4">4 Stars</option>' +
							'<option value="3">3 Stars</option>' +
							'<option value="2">2 Stars</option>' +
							'<option value="1">1 Star</option>' +
						'</select>' +
					'</td>' +
					'<td><textarea name="manual_reviews[' + rowCount + '][text]" rows="2" style="width: 100%; min-width: 200px;"></textarea></td>' +
					'<td><input type="text" name="manual_reviews[' + rowCount + '][date]" value="' + new Date().toISOString().split(\'T\')[0] + '" placeholder="YYYY-MM-DD" style="width: 100px;" /></td>' +
					'<td><button type="button" class="button button-link-delete cos-btn-remove">Delete</button></td>';
				tableBody.appendChild(newRow);
				rowCount++;
			});

			tableBody.addEventListener('click', function(e) {
				if (e.target && e.target.classList.contains('cos-btn-remove')) {
					e.preventDefault();
					var row = e.target.closest('tr');
					row.parentNode.removeChild(row);
				}
			});
		});
	</script>
	<?php
}

/**
 * Save Shop Meta Box Data and trigger API Sync
 */
function coloradospringstattooreview_save_shop_meta( $post_id ) {
	// Check if our nonce is set.
	if ( ! isset( $_POST['coloradospringstattooreview_shop_meta_nonce'] ) ) {
		return;
	}

	// Verify that the nonce is valid.
	if ( ! wp_verify_nonce( $_POST['coloradospringstattooreview_shop_meta_nonce'], 'coloradospringstattooreview_save_shop_meta' ) ) {
		return;
	}

	// If this is an autosave, our form has not been submitted, so we don't want to do anything.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	// Check the user's permissions.
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Save fields
	if ( isset( $_POST['shop_rating'] ) ) {
		update_post_meta( $post_id, '_tattoo_shop_rating', sanitize_text_field( $_POST['shop_rating'] ) );
	}
	if ( isset( $_POST['shop_price_range'] ) ) {
		update_post_meta( $post_id, '_tattoo_shop_price_range', sanitize_text_field( $_POST['shop_price_range'] ) );
	}
	if ( isset( $_POST['shop_address'] ) ) {
		update_post_meta( $post_id, '_tattoo_shop_address', sanitize_text_field( $_POST['shop_address'] ) );
	}
	if ( isset( $_POST['shop_phone'] ) ) {
		update_post_meta( $post_id, '_tattoo_shop_phone', sanitize_text_field( $_POST['shop_phone'] ) );
	}
	if ( isset( $_POST['shop_website'] ) ) {
		update_post_meta( $post_id, '_tattoo_shop_website', esc_url_raw( $_POST['shop_website'] ) );
	}
	if ( isset( $_POST['shop_hours'] ) ) {
		update_post_meta( $post_id, '_tattoo_shop_hours', sanitize_textarea_field( $_POST['shop_hours'] ) );
	}

	// Capture previous and new Google IDs to detect changes
	$old_google_id = get_post_meta( $post_id, '_tattoo_shop_google_place_id', true );
	$new_google_id = isset( $_POST['shop_google_place_id'] ) ? sanitize_text_field( $_POST['shop_google_place_id'] ) : '';

	update_post_meta( $post_id, '_tattoo_shop_google_place_id', $new_google_id );

	// Save manual reviews
	$manual_reviews = array();
	if ( isset( $_POST['manual_reviews'] ) && is_array( $_POST['manual_reviews'] ) ) {
		foreach ( $_POST['manual_reviews'] as $review ) {
			if ( ! empty( $review['author'] ) ) {
				$manual_reviews[] = array(
					'author'   => sanitize_text_field( $review['author'] ),
					'platform' => sanitize_text_field( $review['platform'] ),
					'rating'   => intval( $review['rating'] ),
					'text'     => sanitize_textarea_field( $review['text'] ),
					'date'     => sanitize_text_field( $review['date'] ),
				);
			}
		}
	}
	update_post_meta( $post_id, '_tattoo_shop_manual_reviews', $manual_reviews );

	// Fetch API reviews if changed, or if last fetched is more than 24 hours ago
	$last_fetched = get_post_meta( $post_id, '_tattoo_shop_last_fetched', true );
	$force_fetch  = ( $new_google_id !== $old_google_id ) || empty( $last_fetched ) || ( time() - intval( $last_fetched ) > 86400 );

	if ( $force_fetch ) {
		$fetched_reviews = array();

		// Fetch Google reviews
		if ( ! empty( $new_google_id ) ) {
			$google_reviews = coloradospringstattooreview_fetch_google_reviews( $new_google_id );
			if ( is_array( $google_reviews ) ) {
				$fetched_reviews = array_merge( $fetched_reviews, $google_reviews );
			}
		}

		update_post_meta( $post_id, '_tattoo_shop_fetched_reviews', $fetched_reviews );
		update_post_meta( $post_id, '_tattoo_shop_last_fetched', time() );
	} else {
		$fetched_reviews = get_post_meta( $post_id, '_tattoo_shop_fetched_reviews', true );
		if ( ! is_array( $fetched_reviews ) ) {
			$fetched_reviews = array();
		}
	}

	// Merge manual and fetched reviews
	$all_reviews = array_merge( $manual_reviews, $fetched_reviews );

	// Sort reviews by date descending
	usort( $all_reviews, function( $a, $b ) {
		return strcmp( $b['date'], $a['date'] );
	} );

	update_post_meta( $post_id, '_tattoo_shop_reviews', $all_reviews );
}
add_action( 'save_post_tattoo_shops', 'coloradospringstattooreview_save_shop_meta' );

/**
 * Fetch reviews from Google Places API
 */
function coloradospringstattooreview_fetch_google_reviews( $place_id ) {
	$api_key = get_option( 'cos_google_api_key', '' );
	if ( empty( $api_key ) ) {
		return array();
	}

	$url      = sprintf( 'https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=reviews&key=%s', urlencode( $place_id ), urlencode( $api_key ) );
	$response = wp_remote_get( $url );

	if ( is_wp_error( $response ) ) {
		return array();
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( empty( $body ) || ! isset( $body['result']['reviews'] ) || ! is_array( $body['result']['reviews'] ) ) {
		return array();
	}

	$reviews = array();
	foreach ( $body['result']['reviews'] as $google_review ) {
		$reviews[] = array(
			'author'   => $google_review['author_name'],
			'platform' => 'google',
			'rating'   => intval( $google_review['rating'] ),
			'text'     => $google_review['text'],
			'date'     => date( 'Y-m-d', intval( $google_review['time'] ) ),
		);
	}

	return $reviews;
}

/**
 * AJAX Bulk Importer from Google Places
 */
function coloradospringstattooreview_ajax_bulk_import_google() {
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'cos_bulk_import_nonce' ) ) {
		wp_send_json_error( __( 'Security verification failed.', 'coloradospringstattooreview' ) );
	}

	$api_key = get_option( 'cos_google_api_key', '' );
	if ( empty( $api_key ) ) {
		wp_send_json_error( __( 'Please save a valid Google Places API Key first.', 'coloradospringstattooreview' ) );
	}

	$logs = array();
	$logs[] = 'Querying Google Places for "tattoo shops in Colorado Springs"...';

	$url = sprintf(
		'https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s&key=%s',
		urlencode( 'tattoo shops in Colorado Springs' ),
		urlencode( $api_key )
	);

	$response = wp_remote_get( $url );
	if ( is_wp_error( $response ) ) {
		wp_send_json_error( __( 'Failed to reach Google Places API. Check server connection.', 'coloradospringstattooreview' ) );
	}

	$body = json_decode( wp_remote_retrieve_body( $response ), true );
	if ( empty( $body ) || ! isset( $body['results'] ) || ! is_array( $body['results'] ) ) {
		wp_send_json_error( __( 'No results returned from Google search.', 'coloradospringstattooreview' ) );
	}

	$results = $body['results'];
	$imported_count = 0;
	$skipped_count = 0;

	foreach ( $results as $place ) {
		$name     = sanitize_text_field( $place['name'] );
		$place_id = sanitize_text_field( $place['place_id'] );

		// Check if a post already exists with this Place ID
		$existing = get_posts( array(
			'post_type'   => 'tattoo_shops',
			'meta_key'    => '_tattoo_shop_google_place_id',
			'meta_value'  => $place_id,
			'post_status' => 'any',
		) );

		if ( ! empty( $existing ) ) {
			$logs[] = sprintf( 'Shop "%s" already exists in database. Skipping...', $name );
			$skipped_count++;
			continue;
		}

		// Create the new post
		$post_id = wp_insert_post( array(
			'post_title'   => $name,
			'post_content' => sprintf( 'A professional tattoo studio in Colorado Springs. Real reviews aggregated from Google Places details.', $name ),
			'post_status'  => 'publish',
			'post_type'    => 'tattoo_shops',
		) );

		if ( is_wp_error( $post_id ) ) {
			$logs[] = sprintf( 'Failed to create post for "%s".', $name );
			continue;
		}

		// Save baseline Place metadata
		update_post_meta( $post_id, '_tattoo_shop_google_place_id', $place_id );
		update_post_meta( $post_id, '_tattoo_shop_rating', floatval( $place['rating'] ) );
		update_post_meta( $post_id, '_tattoo_shop_address', sanitize_text_field( $place['formatted_address'] ) );

		// Details lookup
		$details_url = sprintf(
			'https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=formatted_phone_number,website,opening_hours,reviews&key=%s',
			urlencode( $place_id ),
			urlencode( $api_key )
		);

		$details_response = wp_remote_get( $details_url );
		if ( ! is_wp_error( $details_response ) ) {
			$details_body = json_decode( wp_remote_retrieve_body( $details_response ), true );
			if ( ! empty( $details_body ) && isset( $details_body['result'] ) ) {
				$result = $details_body['result'];

				if ( isset( $result['formatted_phone_number'] ) ) {
					update_post_meta( $post_id, '_tattoo_shop_phone', sanitize_text_field( $result['formatted_phone_number'] ) );
				}
				if ( isset( $result['website'] ) ) {
					update_post_meta( $post_id, '_tattoo_shop_website', esc_url_raw( $result['website'] ) );
				}
				if ( isset( $result['opening_hours']['weekday_text'] ) && is_array( $result['opening_hours']['weekday_text'] ) ) {
					$hours_text = implode( "\n", $result['opening_hours']['weekday_text'] );
					update_post_meta( $post_id, '_tattoo_shop_hours', sanitize_textarea_field( $hours_text ) );
				}

				if ( isset( $result['reviews'] ) && is_array( $result['reviews'] ) ) {
					$google_reviews = array();
					foreach ( $result['reviews'] as $google_review ) {
						$google_reviews[] = array(
							'author'   => sanitize_text_field( $google_review['author_name'] ),
							'platform' => 'google',
							'rating'   => intval( $google_review['rating'] ),
							'text'     => sanitize_textarea_field( $google_review['text'] ),
							'date'     => date( 'Y-m-d', intval( $google_review['time'] ) ),
						);
					}
					update_post_meta( $post_id, '_tattoo_shop_reviews', $google_reviews );
				}
			}
		}

		$logs[] = sprintf( 'Imported "%s" successfully with details & reviews.', $name );
		$imported_count++;
	}

	wp_send_json_success( array(
		'message' => sprintf( 'Imported %d new shops. Skipped %d duplicate shops.', $imported_count, $skipped_count ),
		'logs'    => $logs
	) );
}
add_action( 'wp_ajax_cos_bulk_import_google', 'coloradospringstattooreview_ajax_bulk_import_google' );

/**
 * AJAX Bulk Importer from CSV File
 */
function coloradospringstattooreview_ajax_bulk_import_csv() {
	if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( $_POST['nonce'], 'cos_bulk_import_nonce' ) ) {
		wp_send_json_error( __( 'Security verification failed.', 'coloradospringstattooreview' ) );
	}

	if ( ! isset( $_FILES['csv_file'] ) ) {
		wp_send_json_error( __( 'No CSV file uploaded.', 'coloradospringstattooreview' ) );
	}

	$file = $_FILES['csv_file']['tmp_name'];
	if ( ! is_file( $file ) || ! is_readable( $file ) ) {
		wp_send_json_error( __( 'CSV file is unreadable.', 'coloradospringstattooreview' ) );
	}

	$logs = array();
	$handle = fopen( $file, 'r' );
	if ( ! $handle ) {
		wp_send_json_error( __( 'Failed to open CSV file.', 'coloradospringstattooreview' ) );
	}

	$headers = fgetcsv( $handle, 1000, ',' );
	$header_map = array_flip( array_map( 'strtolower', array_map( 'trim', $headers ) ) );

	if ( ! isset( $header_map['name'] ) ) {
		fclose( $handle );
		wp_send_json_error( __( 'Missing required CSV column: "name". Please configure the CSV file headers properly.', 'coloradospringstattooreview' ) );
	}

	$imported_count = 0;
	$skipped_count = 0;
	$api_key = get_option( 'cos_google_api_key', '' );

	while ( ( $row = fgetcsv( $handle, 1000, ',' ) ) !== false ) {
		$name     = isset( $header_map['name'] ) && isset( $row[ $header_map['name'] ] ) ? sanitize_text_field( trim( $row[ $header_map['name'] ] ) ) : '';
		$address  = isset( $header_map['address'] ) && isset( $row[ $header_map['address'] ] ) ? sanitize_text_field( trim( $row[ $header_map['address'] ] ) ) : '';
		$phone    = isset( $header_map['phone'] ) && isset( $row[ $header_map['phone'] ] ) ? sanitize_text_field( trim( $row[ $header_map['phone'] ] ) ) : '';
		$website  = isset( $header_map['website'] ) && isset( $row[ $header_map['website'] ] ) ? esc_url_raw( trim( $row[ $header_map['website'] ] ) ) : '';
		$rating   = isset( $header_map['rating'] ) && isset( $row[ $header_map['rating'] ] ) ? floatval( trim( $row[ $header_map['rating'] ] ) ) : 4.5;
		$place_id = isset( $header_map['place_id'] ) && isset( $row[ $header_map['place_id'] ] ) ? sanitize_text_field( trim( $row[ $header_map['place_id'] ] ) ) : '';

		if ( empty( $name ) ) {
			continue;
		}

		$existing = get_posts( array(
			'title'       => $name,
			'post_type'   => 'tattoo_shops',
			'post_status' => 'any',
		) );

		if ( ! empty( $existing ) ) {
			$logs[] = sprintf( 'Shop "%s" already exists in database. Skipping...', $name );
			$skipped_count++;
			continue;
		}

		$post_id = wp_insert_post( array(
			'post_title'   => $name,
			'post_content' => sprintf( 'A professional tattoo studio in Colorado Springs. Imported via CSV.', $name ),
			'post_status'  => 'publish',
			'post_type'    => 'tattoo_shops',
		) );

		if ( is_wp_error( $post_id ) ) {
			$logs[] = sprintf( 'Failed to import "%s".', $name );
			continue;
		}

		update_post_meta( $post_id, '_tattoo_shop_rating', $rating );
		update_post_meta( $post_id, '_tattoo_shop_address', $address );
		update_post_meta( $post_id, '_tattoo_shop_phone', $phone );
		update_post_meta( $post_id, '_tattoo_shop_website', $website );

		if ( ! empty( $place_id ) ) {
			update_post_meta( $post_id, '_tattoo_shop_google_place_id', $place_id );

			if ( ! empty( $api_key ) ) {
				$details_url = sprintf(
					'https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=formatted_phone_number,website,opening_hours,reviews&key=%s',
					urlencode( $place_id ),
					urlencode( $api_key )
				);

				$details_response = wp_remote_get( $details_url );
				if ( ! is_wp_error( $details_response ) ) {
					$details_body = json_decode( wp_remote_retrieve_body( $details_response ), true );
					if ( ! empty( $details_body ) && isset( $details_body['result'] ) ) {
						$result = $details_body['result'];

						if ( isset( $result['formatted_phone_number'] ) && empty( $phone ) ) {
							update_post_meta( $post_id, '_tattoo_shop_phone', sanitize_text_field( $result['formatted_phone_number'] ) );
						}
						if ( isset( $result['website'] ) && empty( $website ) ) {
							update_post_meta( $post_id, '_tattoo_shop_website', esc_url_raw( $result['website'] ) );
						}
						if ( isset( $result['opening_hours']['weekday_text'] ) ) {
							$hours_text = implode( "\n", $result['opening_hours']['weekday_text'] );
							update_post_meta( $post_id, '_tattoo_shop_hours', sanitize_textarea_field( $hours_text ) );
						}

						if ( isset( $result['reviews'] ) && is_array( $result['reviews'] ) ) {
							$google_reviews = array();
							foreach ( $result['reviews'] as $google_review ) {
								$google_reviews[] = array(
									'author'   => sanitize_text_field( $google_review['author_name'] ),
									'platform' => 'google',
									'rating'   => intval( $google_review['rating'] ),
									'text'     => sanitize_textarea_field( $google_review['text'] ),
									'date'     => date( 'Y-m-d', intval( $google_review['time'] ) ),
								);
							}
							update_post_meta( $post_id, '_tattoo_shop_reviews', $google_reviews );
						}
					}
				}
			}
		}

		$logs[] = sprintf( 'Imported "%s" via CSV.', $name );
		$imported_count++;
	}

	fclose( $handle );

	wp_send_json_success( array(
		'message' => sprintf( 'Imported %d shops from CSV. Skipped %d duplicate shops.', $imported_count, $skipped_count ),
		'logs'    => $logs
	) );
}
add_action( 'wp_ajax_cos_bulk_import_csv', 'coloradospringstattooreview_ajax_bulk_import_csv' );

/**
 * Automatically populate dummy tattoo shops and reviews for testing.
 * Triggers when logged in as admin and visiting http://yoursite.local/?cos_populate_dummy_data=1
 */
function coloradospringstattooreview_maybe_populate_dummy_data() {
	if ( is_admin() && current_user_can( 'manage_options' ) && isset( $_GET['cos_populate_dummy_data'] ) ) {
		
		$shops = array(
			array(
				'title' => 'Pens & Needles Tattoo Studio',
				'desc' => 'A premier tattoo studio located in the heart of Colorado Springs, known for custom designs and custom body piercings in a clean, sterile environment.',
				'rating' => '4.8',
				'price' => '$$$',
				'address' => '101 N Tejon St, Colorado Springs, CO 80903',
				'phone' => '(719) 287-8282',
				'website' => 'https://www.pens-needles.com',
				'hours' => "Mon - Thu: 12:00 PM - 8:00 PM\nFri - Sat: 12:00 PM - 10:00 PM\nSun: Closed",
				'reviews' => array(
					array(
						'author' => 'Sarah Jenkins',
						'platform' => 'google',
						'rating' => 5,
						'text' => 'Absolutely amazing experience. Got a fine-line floral piece from Mark. He was extremely detailed, patient, and made sure the placement was perfect before starting. The shop is spotless and the music playlist was great.',
						'date' => '2026-06-15'
					),
					array(
						'author' => 'David Miller',
						'platform' => 'yelp',
						'rating' => 3,
						'text' => 'The tattoo artists are incredibly talented, but the scheduling system is a mess. I had an appointment booked weeks in advance, but still had to wait 45 minutes past my start time before getting in the chair. Work is 5 stars, service is 2 stars.',
						'date' => '2026-05-20'
					),
					array(
						'author' => 'Amanda R.',
						'platform' => 'google',
						'rating' => 4,
						'text' => 'Very clean and professional shop. I got my first tattoo here and they walked me through all the aftercare steps. A bit on the pricey side, but you get what you pay for!',
						'date' => '2026-06-01'
					),
					array(
						'author' => 'Chris T.',
						'platform' => 'facebook',
						'rating' => 2,
						'text' => 'Disappointed with the communication. Emailed a reference image twice and was told everything was set, but when I showed up, the artist had done a completely different sketch and seemed annoyed when I asked for adjustments.',
						'date' => '2026-04-12'
					)
				)
			),
			array(
				'title' => 'Self Inflicted Tattoo',
				'desc' => 'Providing high quality custom tattooing and body piercing in a safe, professional, and friendly environment since 2009.',
				'rating' => '4.5',
				'price' => '$$',
				'address' => '2020 West Colorado Ave, Colorado Springs, CO 80904',
				'phone' => '(719) 635-1811',
				'website' => 'https://selfinflictedtattoo.com',
				'hours' => "Mon - Sun: 12:00 PM - 8:00 PM",
				'reviews' => array(
					array(
						'author' => 'John Doe',
						'platform' => 'google',
						'rating' => 5,
						'text' => 'Got a traditional eagle from James. Clean lines, solid color packing, and done incredibly fast. Highly recommend this shop for American Traditional work!',
						'date' => '2026-06-25'
					),
					array(
						'author' => 'Jessica B.',
						'platform' => 'yelp',
						'rating' => 3,
						'text' => 'The tattoo turned out okay, but the artist was super quiet and didn\'t really explain what he was doing. It felt a bit like an assembly line. Decent price, though.',
						'date' => '2026-06-10'
					),
					array(
						'author' => 'Robert K.',
						'platform' => 'direct',
						'rating' => 5,
						'text' => 'Awesome shop vibe, super friendly staff. Felt comfortable the entire time.',
						'date' => '2026-07-02'
					)
				)
			)
		);

		foreach ( $shops as $shop ) {
			// Check if shop already exists to prevent duplicates
			$existing = get_posts( array(
				'title'     => $shop['title'],
				'post_type' => 'tattoo_shops',
				'post_status' => 'any',
			) );

			if ( ! empty( $existing ) ) {
				continue;
			}

			// Insert Post
			$post_id = wp_insert_post( array(
				'post_title'   => $shop['title'],
				'post_content' => $shop['desc'],
				'post_status'  => 'publish',
				'post_type'    => 'tattoo_shops',
			) );

			if ( ! is_wp_error( $post_id ) ) {
				// Save Meta
				update_post_meta( $post_id, '_tattoo_shop_rating', $shop['rating'] );
				update_post_meta( $post_id, '_tattoo_shop_price_range', $shop['price'] );
				update_post_meta( $post_id, '_tattoo_shop_address', $shop['address'] );
				update_post_meta( $post_id, '_tattoo_shop_phone', $shop['phone'] );
				update_post_meta( $post_id, '_tattoo_shop_website', $shop['website'] );
				update_post_meta( $post_id, '_tattoo_shop_hours', $shop['hours'] );
				
				// Save reviews (both manual and final display array)
				update_post_meta( $post_id, '_tattoo_shop_manual_reviews', $shop['reviews'] );
				update_post_meta( $post_id, '_tattoo_shop_reviews', $shop['reviews'] );
			}
		}

		wp_safe_redirect( admin_url( 'edit.php?post_type=tattoo_shops' ) );
		exit;
	}
}
add_action( 'admin_init', 'coloradospringstattooreview_maybe_populate_dummy_data' );
