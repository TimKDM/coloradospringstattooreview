<?php
/**
 * The header template
 *
 * @package Colorado_Springs_Tattoo_Review
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
	<header id="masthead" class="site-header">
		<div class="container header-container">
			<div class="site-logo">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
					COS <span>Tattoo Review</span>
				</a>
			</div>
			
			<nav id="site-navigation" class="main-navigation">
				<ul>
					<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'coloradospringstattooreview' ); ?></a></li>
					<li><a href="<?php echo esc_url( get_post_type_archive_link( 'tattoo_shops' ) ); ?>"><?php esc_html_e( 'Tattoo Shops', 'coloradospringstattooreview' ); ?></a></li>
				</ul>
			</nav>
		</div>
	</header>
