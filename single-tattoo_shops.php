<?php
/**
 * The template for displaying all single tattoo shop posts
 *
 * @package Colorado_Springs_Tattoo_Review
 */

get_header();
?>

<?php
while ( have_posts() ) :
	the_post();

	// Retrieve custom metadata for the tattoo shop
	$rating       = get_post_meta( get_the_ID(), '_tattoo_shop_rating', true );
	$address      = get_post_meta( get_the_ID(), '_tattoo_shop_address', true );
	$phone        = get_post_meta( get_the_ID(), '_tattoo_shop_phone', true );
	$website      = get_post_meta( get_the_ID(), '_tattoo_shop_website', true );
	$hours        = get_post_meta( get_the_ID(), '_tattoo_shop_hours', true );
	$price         = get_post_meta( get_the_ID(), '_tattoo_shop_price_range', true ); // e.g. $, $$, $$$
	$reviews_meta = get_post_meta( get_the_ID(), '_tattoo_shop_reviews', true );

	$reviews = is_array( $reviews_meta ) ? $reviews_meta : array();
	$total_reviews = count( $reviews );
	$avg_rating = 0;
	$positive_count = 0;
	$critical_count = 0;
	$positive_reviews = array();
	$critical_reviews = array();

	if ( $total_reviews > 0 ) {
		$rating_sum = 0;
		foreach ( $reviews as $r ) {
			$rating_val = intval( $r['rating'] );
			$rating_sum += $rating_val;
			if ( $rating_val >= 4 ) {
				$positive_count++;
				$positive_reviews[] = $r;
			} else {
				$critical_count++;
				$critical_reviews[] = $r;
			}
		}
		$avg_rating = round( $rating_sum / $total_reviews, 1 );
	} else {
		$avg_rating = ! empty( $rating ) ? floatval( $rating ) : 0;
	}

	$positive_pct = $total_reviews > 0 ? round( ( $positive_count / $total_reviews ) * 100 ) : 0;
	$critical_pct = $total_reviews > 0 ? round( ( $critical_count / $total_reviews ) * 100 ) : 0;

	// Hero background from featured image
	$hero_bg_url = get_the_post_thumbnail_url( get_the_ID(), 'full' );
	$hero_style  = $hero_bg_url ? 'style="background-image: url(' . esc_url( $hero_bg_url ) . ');"' : '';
	?>

	<section class="hero-banner" <?php echo $hero_style; ?>>
		<div class="container">
			<div class="hero-content">
				<div class="hero-tagline"><?php esc_html_e( 'Tattoo Shop Review', 'coloradospringstattooreview' ); ?></div>
				<h1 class="hero-title"><?php the_title(); ?></h1>
				
				<?php if ( $avg_rating > 0 ) : ?>
					<div class="rating-badge">
						<span class="star-icon">★</span>
						<span class="rating-value"><?php echo esc_html( number_format( $avg_rating, 1 ) ); ?> / 5.0</span>
						<?php if ( $total_reviews > 0 ) : ?>
							<span style="font-size: 0.8rem; font-weight: 500; opacity: 0.8; margin-left: 4px;">(<?php echo $total_reviews; ?>)</span>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</section>

	<div class="container">
		<main class="shop-grid">
			
			<!-- Main Content Area -->
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'shop-main-content' ); ?>>
				<div class="shop-meta-bar">
					<?php if ( ! empty( $price ) ) : ?>
						<div class="shop-meta-item">
							<strong><?php esc_html_e( 'Price Range:', 'coloradospringstattooreview' ); ?></strong>
							<span><?php echo esc_html( $price ); ?></span>
						</div>
					<?php endif; ?>
					
					<div class="shop-meta-item">
						<strong><?php esc_html_e( 'Published:', 'coloradospringstattooreview' ); ?></strong>
						<span><?php echo get_the_date(); ?></span>
					</div>
				</div>

				<div class="entry-content">
					<?php
					the_content(
						sprintf(
							wp_kses(
								/* translators: %s: Name of current post. Only visible to screen readers */
								__( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'coloradospringstattooreview' ),
								array(
									'span' => array(
										'class' => array(),
									),
								)
							),
							wp_kses_post( get_the_title() )
						)
					);
					?>
				</div>
			</article>

			<!-- Sidebar Info Widget -->
			<aside class="shop-sidebar">
				<div class="sidebar-widget">
					<h3 class="widget-title"><?php esc_html_e( 'Shop Information', 'coloradospringstattooreview' ); ?></h3>
					
					<div style="display: flex; flex-direction: column; gap: 16px;">
						<?php if ( ! empty( $address ) ) : ?>
							<div>
								<div style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 600;"><?php esc_html_e( 'Location', 'coloradospringstattooreview' ); ?></div>
								<div style="font-weight: 500; margin-top: 2px;"><?php echo esc_html( $address ); ?></div>
							</div>
						<?php endif; ?>

						<?php if ( ! empty( $phone ) ) : ?>
							<div>
								<div style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 600;"><?php esc_html_e( 'Phone', 'coloradospringstattooreview' ); ?></div>
								<div style="font-weight: 500; margin-top: 2px;">
									<a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ); ?>">
										<?php echo esc_html( $phone ); ?>
									</a>
								</div>
							</div>
						<?php endif; ?>

						<?php if ( ! empty( $website ) ) : ?>
							<div>
								<div style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 600;"><?php esc_html_e( 'Website', 'coloradospringstattooreview' ); ?></div>
								<div style="font-weight: 500; margin-top: 2px;">
									<a href="<?php echo esc_url( $website ); ?>" target="_blank" rel="noopener noreferrer">
										<?php echo esc_html( wp_parse_url( $website, PHP_URL_HOST ) ); ?> ↗
									</a>
								</div>
							</div>
						<?php endif; ?>

						<?php if ( ! empty( $hours ) ) : ?>
							<div>
								<div style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; font-weight: 600;"><?php esc_html_e( 'Hours', 'coloradospringstattooreview' ); ?></div>
								<div style="font-weight: 500; margin-top: 2px; white-space: pre-line;"><?php echo esc_html( $hours ); ?></div>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</aside>

		</main>

		<?php if ( $total_reviews > 0 || ! empty( $rating ) ) : ?>
			<section class="reviews-section" style="margin-top: 60px; margin-bottom: 80px; border-top: 1px solid var(--border-color); padding-top: 40px;">
				<h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 30px; letter-spacing: -0.02em; text-align: center;">
					<?php esc_html_e( 'Review Breakdown & Full Picture', 'coloradospringstattooreview' ); ?>
				</h2>

				<!-- Summary Dashboard -->
				<div class="reviews-summary-dashboard">
					<div class="summary-metric-box">
						<div class="metric-score"><?php echo number_format( $avg_rating, 1 ); ?></div>
						<div class="metric-stars">
							<?php
							$full_stars = floor( $avg_rating );
							for ( $i = 1; $i <= 5; $i++ ) {
								if ( $i <= $full_stars ) {
									echo '<span class="star-filled">★</span>';
								} else {
									echo '<span class="star-empty">★</span>';
								}
							}
							?>
						</div>
						<div class="metric-label"><?php echo esc_html( sprintf( _n( 'Based on %d customer review', 'Based on %d customer reviews', $total_reviews, 'coloradospringstattooreview' ), $total_reviews ) ); ?></div>
					</div>
					
					<div class="summary-bars-box">
						<!-- Positive Bar -->
						<div class="summary-bar-row">
							<div class="bar-label"><strong><?php esc_html_e( 'Positive Reviews', 'coloradospringstattooreview' ); ?></strong> (4-5 ★)</div>
							<div class="bar-wrapper">
								<div class="bar-fill bar-fill-positive" style="width: <?php echo esc_attr( $positive_pct ); ?>%;"></div>
							</div>
							<div class="bar-value"><?php echo esc_html( $positive_pct ); ?>%</div>
						</div>
						
						<!-- Critical Review Bar -->
						<div class="summary-bar-row">
							<div class="bar-label"><strong><?php esc_html_e( 'Critical Reviews', 'coloradospringstattooreview' ); ?></strong> (1-3 ★)</div>
							<div class="bar-wrapper">
								<div class="bar-fill bar-fill-critical" style="width: <?php echo esc_attr( $critical_pct ); ?>%;"></div>
							</div>
							<div class="bar-value"><?php echo esc_html( $critical_pct ); ?>%</div>
						</div>
					</div>
				</div>

				<!-- Split Columns Grid -->
				<div class="reviews-split-grid">
					
					<!-- Positive Reviews Column -->
					<div class="review-col col-positive">
						<h3 class="col-title title-positive">
							<span class="col-icon">✔</span> <?php esc_html_e( 'Positive Reviews', 'coloradospringstattooreview' ); ?> 
							<span class="col-count">(<?php echo esc_html( $positive_count ); ?>)</span>
						</h3>
						
						<div class="reviews-list">
							<?php if ( empty( $positive_reviews ) ) : ?>
								<p class="no-reviews-msg"><?php esc_html_e( 'No positive reviews added yet.', 'coloradospringstattooreview' ); ?></p>
							<?php else : ?>
								<?php foreach ( $positive_reviews as $r ) : ?>
									<div class="review-card card-positive">
										<div class="review-header">
											<div class="review-author"><?php echo esc_html( $r['author'] ); ?></div>
											<div class="review-meta">
												<span class="platform-badge platform-<?php echo esc_attr( $r['platform'] ); ?>">
													<?php echo esc_html( ucfirst( $r['platform'] ) ); ?>
												</span>
												<span class="review-date"><?php echo esc_html( $r['date'] ); ?></span>
											</div>
										</div>
										<div class="review-stars-row">
											<?php
											for ( $i = 1; $i <= 5; $i++ ) {
												echo $i <= intval( $r['rating'] ) ? '★' : '☆';
											}
											?>
										</div>
										<div class="review-text"><?php echo esc_html( $r['text'] ); ?></div>
									</div>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					</div>

					<!-- Critical Reviews Column -->
					<div class="review-col col-critical">
						<h3 class="col-title title-critical">
							<span class="col-icon">⚠</span> <?php esc_html_e( 'Critical Reviews', 'coloradospringstattooreview' ); ?>
							<span class="col-count">(<?php echo esc_html( $critical_count ); ?>)</span>
						</h3>
						
						<div class="reviews-list">
							<?php if ( empty( $critical_reviews ) ) : ?>
								<p class="no-reviews-msg"><?php esc_html_e( 'No critical reviews added yet.', 'coloradospringstattooreview' ); ?></p>
							<?php else : ?>
								<?php foreach ( $critical_reviews as $r ) : ?>
									<div class="review-card card-critical">
										<div class="review-header">
											<div class="review-author"><?php echo esc_html( $r['author'] ); ?></div>
											<div class="review-meta">
												<span class="platform-badge platform-<?php echo esc_attr( $r['platform'] ); ?>">
													<?php echo esc_html( ucfirst( $r['platform'] ) ); ?>
												</span>
												<span class="review-date"><?php echo esc_html( $r['date'] ); ?></span>
											</div>
										</div>
										<div class="review-stars-row">
											<?php
											for ( $i = 1; $i <= 5; $i++ ) {
												echo $i <= intval( $r['rating'] ) ? '★' : '☆';
											}
											?>
										</div>
										<div class="review-text"><?php echo esc_html( $r['text'] ); ?></div>
									</div>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					</div>

				</div>
			</section>
		<?php endif; ?>

	</div>

	<?php
endwhile;

get_footer();
