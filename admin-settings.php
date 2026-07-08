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
}
add_action( 'admin_init', 'coloradospringstattooreview_settings_init' );

function coloradospringstattooreview_section_desc() {
	echo '<p>' . esc_html__( 'Configure the API keys below to enable automatic review fetching from Google. Yelp integrations have been removed to keep your site 100% free.', 'coloradospringstattooreview' ) . '</p>';
}

function coloradospringstattooreview_google_api_key_markup() {
	$value = get_option( 'cos_google_api_key', '' );
	echo '<input type="password" name="cos_google_api_key" value="' . esc_attr( $value ) . '" class="regular-text" />';
	echo '<p class="description">' . esc_html__( 'Required to retrieve reviews based on Google Place ID and run the Bulk Search Importer.', 'coloradospringstattooreview' ) . '</p>';
}

function coloradospringstattooreview_settings_page_html() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		
		<h2 class="nav-tab-wrapper">
			<a href="#tab-api" class="nav-tab nav-tab-active" id="tab-api-link"><?php esc_html_e( 'API Credentials', 'coloradospringstattooreview' ); ?></a>
			<a href="#tab-importer" class="nav-tab" id="tab-importer-link"><?php esc_html_e( 'Bulk Importer', 'coloradospringstattooreview' ); ?></a>
		</h2>

		<!-- Tab 1: API Settings -->
		<div id="tab-api-content" class="tab-content" style="padding-top: 20px;">
			<form action="options.php" method="post">
				<?php
				settings_fields( 'cos_review_settings_group' );
				do_settings_sections( 'cos-review-settings' );
				submit_button( __( 'Save API Settings', 'coloradospringstattooreview' ) );
				?>
			</form>
		</div>

		<!-- Tab 2: Bulk Importer -->
		<div id="tab-importer-content" class="tab-content" style="display: none; padding-top: 20px; max-width: 800px;">
			<h3><?php esc_html_e( 'Bulk Import Colorado Springs Tattoo Shops', 'coloradospringstattooreview' ); ?></h3>
			<p><?php esc_html_e( 'Use one of the two methods below to populate your website directory automatically.', 'coloradospringstattooreview' ); ?></p>
			
			<div style="background: #fff; padding: 20px; border: 1px solid #ccd0d4; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
				<h4>Method A: Google Search API (One-Click Auto Import)</h4>
				<p class="description"><?php esc_html_e( 'Queries Google Places for all matching tattoo shops in Colorado Springs, inserts them, and syncs reviews. (Uses your Google API key).', 'coloradospringstattooreview' ); ?></p>
				<p><button type="button" id="cos-run-google-import" class="button button-primary"><?php esc_html_e( 'Run Google Places Auto Import', 'coloradospringstattooreview' ); ?></button></p>
			</div>

			<div style="background: #fff; padding: 20px; border: 1px solid #ccd0d4; margin-bottom: 20px; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
				<h4>Method B: Scraped CSV Upload (100% Free)</h4>
				<p class="description"><?php esc_html_e( 'Upload a CSV list of tattoo shops you exported using a free Maps scraping browser extension. Supported headers: name, address, phone, website, rating, place_id.', 'coloradospringstattooreview' ); ?></p>
				<p>
					<input type="file" id="cos-csv-file" accept=".csv" />
					<button type="button" id="cos-run-csv-import" class="button button-secondary"><?php esc_html_e( 'Upload & Import CSV', 'coloradospringstattooreview' ); ?></button>
				</p>
			</div>

			<!-- AJAX Progress Console -->
			<div style="margin-top: 30px;">
				<h4>Import Status & Logs</h4>
				<div id="cos-import-log" style="background: #1e1e1e; color: #39ff14; font-family: monospace; padding: 15px; border-radius: 4px; height: 250px; overflow-y: scroll; font-size: 12px; line-height: 1.5; border: 1px solid #000;">
					[Ready] Choose an import method to begin...<br/>
				</div>
			</div>
		</div>
	</div>

	<script>
		document.addEventListener('DOMContentLoaded', function() {
			var tabApiLink = document.getElementById('tab-api-link');
			var tabImporterLink = document.getElementById('tab-importer-link');
			var tabApiContent = document.getElementById('tab-api-content');
			var tabImporterContent = document.getElementById('tab-importer-content');

			function switchTab(activeLink, activeContent, inactiveLink, inactiveContent) {
				activeLink.classList.add('nav-tab-active');
				inactiveLink.classList.remove('nav-tab-active');
				activeContent.style.display = 'block';
				inactiveContent.style.display = 'none';
			}

			tabApiLink.addEventListener('click', function(e) {
				e.preventDefault();
				switchTab(tabApiLink, tabApiContent, tabImporterLink, tabImporterContent);
			});

			tabImporterLink.addEventListener('click', function(e) {
				e.preventDefault();
				switchTab(tabImporterLink, tabImporterContent, tabApiLink, tabApiContent);
			});

			// Logger helper
			var logger = document.getElementById('cos-import-log');
			function log(message, isError) {
				var color = isError ? '#ff4a4a' : '#39ff14';
				logger.innerHTML += '<span style="color: ' + color + ';">[' + new Date().toLocaleTimeString() + '] ' + message + '</span><br/>';
				logger.scrollTop = logger.scrollHeight;
			}

			// Google Search Import
			var btnGoogle = document.getElementById('cos-run-google-import');
			btnGoogle.addEventListener('click', function() {
				if (!confirm('Are you sure you want to run the Google Places Auto Import? This will search and import tattoo shops in Colorado Springs.')) {
					return;
				}
				btnGoogle.disabled = true;
				log('Starting Google Places search query: "tattoo shops in Colorado Springs"...');

				var data = new FormData();
				data.append('action', 'cos_bulk_import_google');
				data.append('nonce', '<?php echo wp_create_nonce("cos_bulk_import_nonce"); ?>');

				fetch(ajaxurl, {
					method: 'POST',
					body: data
				})
				.then(response => response.json())
				.then(res => {
					btnGoogle.disabled = false;
					if (res.success) {
						log(res.data.message);
						if (res.data.logs && Array.isArray(res.data.logs)) {
							res.data.logs.forEach(l => log(l));
						}
						log('Import process finished successfully!');
					} else {
						log('Error: ' + res.data, true);
					}
				})
				.catch(err => {
					btnGoogle.disabled = false;
					log('Connection/server error occurred during import.', true);
				});
			});

			// CSV Upload Import
			var btnCsv = document.getElementById('cos-run-csv-import');
			var fileInput = document.getElementById('cos-csv-file');
			btnCsv.addEventListener('click', function() {
				var file = fileInput.files[0];
				if (!file) {
					alert('Please select a CSV file first.');
					return;
				}
				
				btnCsv.disabled = true;
				log('Reading CSV file: ' + file.name + '...');

				var data = new FormData();
				data.append('action', 'cos_bulk_import_csv');
				data.append('csv_file', file);
				data.append('nonce', '<?php echo wp_create_nonce("cos_bulk_import_nonce"); ?>');

				fetch(ajaxurl, {
					method: 'POST',
					body: data
				})
				.then(response => response.json())
				.then(res => {
					btnCsv.disabled = false;
					if (res.success) {
						log(res.data.message);
						if (res.data.logs && Array.isArray(res.data.logs)) {
							res.data.logs.forEach(l => log(l));
						}
						log('CSV Import process finished successfully!');
					} else {
						log('Error: ' + res.data, true);
					}
				})
				.catch(err => {
					btnCsv.disabled = false;
					log('Connection/server error occurred during CSV import.', true);
				});
			});
		});
	</script>
	<?php
}
