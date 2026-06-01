/**
 * Logo Image Swap — frontend handler.
 *
 * Watches each sticky-enabled section for the `.she-header` class toggle
 * (set by Free's scroll handler) and swaps logo <img src> + srcset to the
 * Pro-supplied sticky variant. Restores the original on revert.
 *
 * Decoupled from Free's scroll handler via MutationObserver — we never
 * compete with Free's logic, we just react to the class change.
 *
 * @package she-header
 * @since   2.2.0
 */

( function () {
	'use strict';

	/**
	 * Selector for logo images we should swap.
	 * Mirrors Free's `change_logo_color` selectors and honors the
	 * `.not-logo` opt-out class convention.
	 */
	var LOGO_SELECTOR =
		'.elementor-widget-theme-site-logo img:not(.not-logo), ' +
		'.elementor-widget-image img:not(.not-logo)';

	/**
	 * Initialize swap behavior for a single sticky section.
	 *
	 * @param {HTMLElement} section The `.she-header-yes` element.
	 */
	function initSection( section ) {
		var settings = parseSettings( section );

		if ( ! settings || settings.she_logo_swap_enable !== 'yes' ) {
			return;
		}

		var newSrc =
			settings.she_logo_swap_image && settings.she_logo_swap_image.url
				? settings.she_logo_swap_image.url
				: '';

		var newSrcRetina =
			settings.she_logo_swap_image_retina &&
			settings.she_logo_swap_image_retina.url
				? settings.she_logo_swap_image_retina.url
				: '';

		if ( ! newSrc ) {
			return;
		}

		var logos = section.querySelectorAll( LOGO_SELECTOR );
		if ( ! logos.length ) {
			return;
		}

		// Cache originals so we can restore on un-sticky.
		logos.forEach( function ( logo ) {
			if ( typeof logo.dataset.sheOriginalSrc === 'undefined' ) {
				logo.dataset.sheOriginalSrc = logo.getAttribute( 'src' ) || '';
				logo.dataset.sheOriginalSrcset =
					logo.getAttribute( 'srcset' ) || '';
				logo.dataset.sheOriginalSizes = logo.getAttribute( 'sizes' ) || '';
			}
		} );

		// Apply / restore based on current sticky state.
		applySwap( section, logos, newSrc, newSrcRetina );

		// React to future class toggles by Free's scroll handler.
		var observer = new MutationObserver( function ( mutations ) {
			for ( var i = 0; i < mutations.length; i++ ) {
				if ( mutations[ i ].attributeName === 'class' ) {
					applySwap( section, logos, newSrc, newSrcRetina );
					break;
				}
			}
		} );

		observer.observe( section, {
			attributes: true,
			attributeFilter: [ 'class' ],
		} );
	}

	/**
	 * Apply the swap (or restore) based on whether the section
	 * currently has the `.she-header` class.
	 *
	 * @param {HTMLElement} section
	 * @param {NodeList}    logos
	 * @param {string}      newSrc
	 * @param {string}      newSrcRetina
	 */
	function applySwap( section, logos, newSrc, newSrcRetina ) {
		var isSticky = section.classList.contains( 'she-header' );

		logos.forEach( function ( logo ) {
			if ( isSticky ) {
				logo.setAttribute( 'src', newSrc );

				if ( newSrcRetina ) {
					logo.setAttribute(
						'srcset',
						newSrc + ' 1x, ' + newSrcRetina + ' 2x'
					);
				} else {
					logo.removeAttribute( 'srcset' );
				}

				// `sizes` becomes meaningless once we've forced 1x/2x; drop it.
				logo.removeAttribute( 'sizes' );
			} else {
				logo.setAttribute(
					'src',
					logo.dataset.sheOriginalSrc || ''
				);

				if ( logo.dataset.sheOriginalSrcset ) {
					logo.setAttribute(
						'srcset',
						logo.dataset.sheOriginalSrcset
					);
				} else {
					logo.removeAttribute( 'srcset' );
				}

				if ( logo.dataset.sheOriginalSizes ) {
					logo.setAttribute(
						'sizes',
						logo.dataset.sheOriginalSizes
					);
				}
			}
		} );
	}

	/**
	 * Safely parse the section's data-settings JSON.
	 *
	 * @param {HTMLElement} section
	 * @return {Object|null}
	 */
	function parseSettings( section ) {
		var raw = section.getAttribute( 'data-settings' );
		if ( ! raw ) {
			return null;
		}
		try {
			return JSON.parse( raw );
		} catch ( e ) {
			return null;
		}
	}

	/**
	 * Bootstrap — find every sticky section and wire it up.
	 */
	function init() {
		var sections = document.querySelectorAll( '.she-header-yes' );
		sections.forEach( initSection );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
