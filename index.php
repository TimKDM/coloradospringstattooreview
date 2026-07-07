<?php
/**
 * The main template file
 *
 * @package Colorado_Springs_Tattoo_Review
 */

get_header();
?>

<div class="container" style="margin-top: 40px; margin-bottom: 80px;">
	<header class="page-header" style="margin-bottom: 40px;">
		<h1 class="page-title" style="font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em;">
			<?php esc_html_e( 'Latest Updates & Reviews', 'coloradospringstattooreview' ); ?>
		</h1>
	</header>

	<div style="display: grid; grid-template-columns: 1fr; gap: 30px;">
		<?php
		if ( have_posts() ) :

			while ( have_posts() ) :
				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'shop-main-content' ); ?>>
					<header class="entry-header">
						<h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 12px; letter-spacing: -0.01em;">
							<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
						</h2>
					</header>

					<div class="entry-summary" style="color: var(--text-secondary); margin-bottom: 20px;">
						<?php the_excerpt(); ?>
					</div>

					<a href="<?php the_permalink(); ?>" class="rating-badge" style="display: inline-flex; justify-content: center;">
						<?php esc_html_e( 'Read Full Review', 'coloradospringstattooreview' ); ?> →
					</a>
				</article>
				<?php
			endwhile;

			the_posts_navigation();

		else :
			?>
			<p><?php esc_html_e( 'No reviews found yet. Stay tuned!', 'coloradospringstattooreview' ); ?></p>
			<?php
		endif;
		?>
	</div>
</div>

<?php
get_footer();
