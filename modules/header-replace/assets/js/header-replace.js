/**
 * Header Replace on Scroll — pair watcher.
 *
 * For each original section tagged with `data-she-replace-pair-id`,
 * locate the matching `[data-she-alternate-for]` wrapper and observe
 * the original's class attribute. When Free toggles `.she-header`,
 * flip the active / swapped-out classes on the pair.
 *
 * Same MutationObserver pattern as the Logo Swap module — decoupled
 * from Free's scroll handler, no race conditions.
 *
 * @package she-header
 * @since   2.2.0
 */

( function () {
	'use strict';

	function init() {
		var originals = document.querySelectorAll( '[data-she-replace-pair-id]' );
		originals.forEach( initPair );
	}

	function initPair( original ) {
		var pairId = original.getAttribute( 'data-she-replace-pair-id' );
		if ( ! pairId ) {
			return;
		}

		var alternate = document.querySelector(
			'[data-she-alternate-for="' + cssEscape( pairId ) + '"]'
		);
		if ( ! alternate ) {
			return;
		}

		function applySwap() {
			var isSticky = original.classList.contains( 'she-header' );
			if ( isSticky ) {
				original.classList.add( 'she-header-original--swapped-out' );
				alternate.classList.add( 'she-header-alternate--active' );
				alternate.setAttribute( 'aria-hidden', 'false' );
				original.setAttribute( 'aria-hidden', 'true' );
			} else {
				original.classList.remove( 'she-header-original--swapped-out' );
				alternate.classList.remove( 'she-header-alternate--active' );
				alternate.setAttribute( 'aria-hidden', 'true' );
				original.removeAttribute( 'aria-hidden' );
			}
		}

		// Reflect any initial sticky state (e.g. page reloaded mid-scroll).
		applySwap();

		var observer = new MutationObserver( function ( mutations ) {
			for ( var i = 0; i < mutations.length; i++ ) {
				if ( mutations[ i ].attributeName === 'class' ) {
					applySwap();
					break;
				}
			}
		} );

		observer.observe( original, {
			attributes: true,
			attributeFilter: [ 'class' ],
		} );
	}

	/**
	 * Minimal CSS-attribute-value escape for use inside querySelector.
	 *
	 * Elementor IDs are normally `[a-f0-9]{7,8}` so an unsafe value is
	 * unlikely, but guarding here keeps the lookup robust if Elementor
	 * ever changes its ID format.
	 *
	 * @param {string} val
	 * @return {string}
	 */
	function cssEscape( val ) {
		if ( typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function' ) {
			return window.CSS.escape( val );
		}
		return String( val ).replace( /(["\\])/g, '\\$1' );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
