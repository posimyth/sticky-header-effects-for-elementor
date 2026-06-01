/**
 * Sticky Until — frontend boundary watcher.
 *
 * For each sticky-enabled section with the feature on, watches scroll
 * position vs. a configured boundary (parent container bottom, page end,
 * or a user-supplied CSS selector). When the boundary is reached, adds
 * `.she-sticky-until-released` to the section so CSS can hide it.
 *
 * Decoupled from Free's scroll handler — uses its own throttled scroll
 * listener with `requestAnimationFrame` and `passive: true` for perf.
 *
 * Boundary recomputation:
 *  - On `resize` and `load` events (handles late-loading images).
 *  - On a 2-second interval (handles lazy-loaded content shifting layout).
 *    Recomputation is cheap (one getBoundingClientRect call per section).
 *
 * @package she-header
 * @since   2.2.0
 */

( function () {
	'use strict';

	function init() {
		var sections = document.querySelectorAll( '.she-header-yes' );
		sections.forEach( initSection );
	}

	function initSection( section ) {
		var settings = parseSettings( section );

		if ( ! settings || settings.she_sticky_until_enable !== 'yes' ) {
			return;
		}

		var config = {
			mode: settings.she_sticky_until_mode || 'container',
			selector: ( settings.she_sticky_until_element_selector || '' ).trim(),
			offset: extractSize( settings.she_sticky_until_offset, 0 ),
			distance: extractSize( settings.she_sticky_until_distance, 500 ),
		};

		var state = {
			boundaryY: null,
			ticking: false,
			released: false,
		};

		function recompute() {
			state.boundaryY = computeBoundary( section, config );
		}

		function evaluate() {
			if ( state.boundaryY === null ) {
				if ( state.released ) {
					state.released = false;
					section.classList.remove( 'she-sticky-until-released' );
				}
				return;
			}

			var scrollPos = window.scrollY || window.pageYOffset || 0;
			var headerHeight = section.offsetHeight || 0;
			var shouldRelease = scrollPos + headerHeight >= state.boundaryY;

			if ( shouldRelease !== state.released ) {
				state.released = shouldRelease;
				section.classList.toggle(
					'she-sticky-until-released',
					shouldRelease
				);
			}
		}

		function onScroll() {
			if ( state.ticking ) {
				return;
			}
			requestAnimationFrame( function () {
				evaluate();
				state.ticking = false;
			} );
			state.ticking = true;
		}

		function onResize() {
			recompute();
			evaluate();
		}

		// Initial setup.
		recompute();
		evaluate();

		window.addEventListener( 'scroll', onScroll, { passive: true } );
		window.addEventListener( 'resize', onResize, { passive: true } );
		window.addEventListener( 'load', onResize );

		// Catch dynamic layout changes (lazy content, accordions, etc.).
		setInterval( recompute, 2000 );
	}

	/**
	 * Compute the document-relative Y position of the boundary,
	 * with the user offset applied.
	 *
	 * @param {HTMLElement} section
	 * @param {{mode:string, selector:string, offset:number, distance:number}} config
	 * @return {number|null}
	 */
	function computeBoundary( section, config ) {
		var boundaryY = null;
		var rect;
		var scrollY = window.scrollY || window.pageYOffset || 0;

		if ( config.mode === 'page' ) {
			boundaryY =
				document.documentElement.scrollHeight - window.innerHeight;
		} else if ( config.mode === 'element' && config.selector ) {
			var el = null;
			try {
				el = document.querySelector( config.selector );
			} catch ( e ) {
				// Invalid selector — silently no-op.
				return null;
			}
			if ( el ) {
				rect = el.getBoundingClientRect();
				boundaryY = rect.top + scrollY;
			}
		} else if ( config.mode === 'container' ) {
			var parent = section.parentElement;
			if ( parent && parent !== document.body ) {
				rect = parent.getBoundingClientRect();
				boundaryY = rect.bottom + scrollY;
			}
		} else if ( config.mode === 'scroll-distance' ) {
			// Evaluator: `scrollPos + headerHeight >= boundaryY`
			// Want: release at exactly scrollPos = config.distance.
			// So boundaryY = distance + headerHeight.
			// headerHeight is recomputed on each `recompute()` so this stays
			// accurate even if Free's Shrink Header changes the height.
			boundaryY = config.distance + ( section.offsetHeight || 0 );
		}

		if ( boundaryY === null ) {
			return null;
		}

		return boundaryY + config.offset;
	}

	/**
	 * Safely extract `size` from an Elementor slider value object.
	 *
	 * @param {*}      val
	 * @param {number} fallback
	 * @return {number}
	 */
	function extractSize( val, fallback ) {
		if ( val && typeof val.size !== 'undefined' ) {
			var n = parseInt( val.size, 10 );
			if ( ! isNaN( n ) ) {
				return n;
			}
		}
		return fallback;
	}

	/**
	 * Parse the section's `data-settings` JSON.
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

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
