<?php
/**
 * The footer template
 *
 * @package Colorado_Springs_Tattoo_Review
 */

?>
	<footer id="colophon" class="site-footer">
		<div class="container footer-content">
			<div class="footer-info">
				<p>&copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', 'coloradospringstattooreview' ); ?></p>
			</div>
			
			<div class="footer-meta" style="font-size: 0.85rem; color: var(--text-muted);">
				<p>
					<?php esc_html_e( 'Crafted by', 'coloradospringstattooreview' ); ?> 
					<a href="https://kingdigitalmarketers.com/" target="_blank" rel="noopener noreferrer" style="font-weight: 600; color: var(--text-secondary);">
						King Digital Marketing
					</a>
				</p>
			</div>
		</div>
	</footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
