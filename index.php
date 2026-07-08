<?php
/**
 * The main template file
 *
 * @package Colorado_Springs_Tattoo_Review
 */

get_header();
?>

<!-- Homepage Hero -->
<section class="home-hero">
	<div class="container">
		<div class="hero-box">
			<h1 class="hero-main-title"><?php esc_html_e( 'Discover the Best Tattoo Studios in Colorado Springs', 'coloradospringstattooreview' ); ?></h1>
			<p class="hero-sub"><?php esc_html_e( 'Compare ratings, read positive and critical reviews, and find your perfect tattoo artist.', 'coloradospringstattooreview' ); ?></p>
			
			<!-- Mock search bar -->
			<div class="search-bar-mock">
				<input type="text" placeholder="<?php esc_attr_e( 'Search shops or styles (e.g., Traditional, Realism)...', 'coloradospringstattooreview' ); ?>" disabled />
				<button type="button"><?php esc_html_e( 'Search', 'coloradospringstattooreview' ); ?></button>
			</div>

			<!-- Quick filters -->
			<div class="quick-filters">
				<span><?php esc_html_e( 'Popular Styles:', 'coloradospringstattooreview' ); ?></span>
				<a href="#" class="style-badge"><?php esc_html_e( 'Traditional', 'coloradospringstattooreview' ); ?></a>
				<a href="#" class="style-badge"><?php esc_html_e( 'Fine Line', 'coloradospringstattooreview' ); ?></a>
				<a href="#" class="style-badge"><?php esc_html_e( 'Realism', 'coloradospringstattooreview' ); ?></a>
				<a href="#" class="style-badge"><?php esc_html_e( 'Black & Grey', 'coloradospringstattooreview' ); ?></a>
			</div>
		</div>
	</div>
</section>

<div class="container" style="margin-bottom: 80px;">
	<header class="section-header" style="margin-bottom: 40px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
		<h2 style="font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em;">
			<?php esc_html_e( 'Featured Tattoo Studios', 'coloradospringstattooreview' ); ?>
		</h2>
	</header>

	<div class="shops-listings-grid">
		<?php
		// Query database for custom post type tattoo_shops
		$args = array(
			'post_type'      => 'tattoo_shops',
			'posts_per_page' => 12,
			'post_status'    => 'publish',
		);
		$query = new WP_Query( $args );

		if ( $query->have_posts() ) :

			while ( $query->have_posts() ) :
				$query->the_post();
				$shop_id = get_the_ID();

				// Metadata
				$rating      = get_post_meta( $shop_id, '_tattoo_shop_rating', true );
				$price       = get_post_meta( $shop_id, '_tattoo_shop_price_range', true );
				$address     = get_post_meta( $shop_id, '_tattoo_shop_address', true );
				$reviews_meta = get_post_meta( $shop_id, '_tattoo_shop_reviews', true );

				$reviews_count = is_array( $reviews_meta ) ? count( $reviews_meta ) : 0;
				$display_rating = ! empty( $rating ) ? floatval( $rating ) : 0.0;
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'shop-card' ); ?>>
					<div class="card-body">
						<header class="card-header">
							<div class="card-meta-top">
								<div class="card-rating">
									<span class="star-icon">★</span>
									<span class="rating-num"><?php echo esc_html( number_format( $display_rating, 1 ) ); ?></span>
									<?php if ( $reviews_count > 0 ) : ?>
										<span class="reviews-count">(<?php echo esc_html( $reviews_count ); ?>)</span>
									<?php endif; ?>
								</div>
								<?php if ( ! empty( $price ) ) : ?>
									<span class="card-price"><?php echo esc_html( $price ); ?></span>
								<?php endif; ?>
							</div>
							<h3 class="card-title">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
							</h3>
						</header>

						<div class="card-excerpt">
							<?php the_excerpt(); ?>
						</div>

						<?php if ( ! empty( $address ) ) : ?>
							<div class="card-location">
								<span class="loc-icon">📍</span> <?php echo esc_html( $address ); ?>
							</div>
						<?php endif; ?>

						<div class="card-footer-action">
							<a href="<?php the_permalink(); ?>" class="action-btn">
								<?php esc_html_e( 'Read Reviews', 'coloradospringstattooreview' ); ?> ➔
							</a>
						</div>
					</div>
				</article>
				<?php
			endwhile;
			wp_reset_postdata();

		else :
			// Database is empty - Render the Static Fallback Array (featuring Riot Tattoo)
			$fallback_shops = array(
				array(
					'title'   => 'Riot Tattoo Co.',
					'rating'  => 4.9,
					'reviews' => 28,
					'price'   => '$$$',
					'desc'    => 'A premium, custom studio specializing in bold, high-contrast designs, fine-line detail work, and American traditional tattooing. Known for clean, sterile setups and extremely detailed consultations.',
					'address' => '5867 N Nevada Ave, Colorado Springs, CO 80918',
					'link'    => '#',
				),
				array(
					'title'   => 'Pens & Needles Tattoo Studio',
					'rating'  => 4.8,
					'reviews' => 45,
					'price'   => '$$$',
					'desc'    => 'One of Colorado Springs\' premier studios, known for its sterile environments and large roster of highly diverse custom artists. Handles cover-ups, realism, lettering, and body piercings.',
					'address' => '101 N Tejon St, Colorado Springs, CO 80903',
					'link'    => '#',
				),
				array(
					'title'   => 'Self Inflicted Tattoo',
					'rating'  => 4.6,
					'reviews' => 19,
					'price'   => '$$',
					'desc'    => 'A local favorite providing high-quality custom body art and professional body piercings in a friendly, comfortable west-side shop. Specializes in bold color packing and traditional designs.',
					'address' => '2020 West Colorado Ave, Colorado Springs, CO 80904',
					'link'    => '#',
				),
			);

			foreach ( $fallback_shops as $shop ) :
				?>
				<article class="shop-card shop-card-fallback">
					<div class="card-body">
						<header class="card-header">
							<div class="card-meta-top">
								<div class="card-rating">
									<span class="star-icon">★</span>
									<span class="rating-num"><?php echo esc_html( number_format( $shop['rating'], 1 ) ); ?></span>
									<span class="reviews-count">(<?php echo esc_html( $shop['reviews'] ); ?>)</span>
								</div>
								<span class="card-price"><?php echo esc_html( $shop['price'] ); ?></span>
							</div>
							<h3 class="card-title">
								<a href="<?php echo esc_url( $shop['link'] ); ?>"><?php echo esc_html( $shop['title'] ); ?></a>
							</h3>
						</header>

						<div class="card-excerpt">
							<p><?php echo esc_html( $shop['desc'] ); ?></p>
						</div>

						<div class="card-location">
							<span class="loc-icon">📍</span> <?php echo esc_html( $shop['address'] ); ?>
						</div>

						<div class="card-footer-action">
							<span class="action-btn-disabled" style="color: var(--text-muted); font-size: 0.85rem; font-weight: 500;">
								<?php esc_html_e( 'Activate theme & add shop to view reviews', 'coloradospringstattooreview' ); ?>
							</span>
						</div>
					</div>
				</article>
				<?php
			endforeach;

		endif;
		?>
	</div>
</div>

<?php
get_footer();
