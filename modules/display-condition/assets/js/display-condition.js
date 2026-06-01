/**
 * Display Condition — frontend shim.
 *
 * The PHP `before_render` hook tags any section whose Display Condition
 * rules failed with `data-she-dc-status="fail"`. This shim runs before
 * Free's scroll handler and strips the `she-header-yes` class from those
 * sections, so Free's `function sheHeader()` finds no targets and applies
 * no sticky behavior.
 *
 * Why a shim and not a CSS rule:
 *   `she-header-yes` is the class Free's JS queries via
 *   `$('.elementor-element.she-header-yes')`. CSS alone can't remove a
 *   class — only JS can. The shim is six lines and zero deps.
 *
 * Enqueued at priority 5 in `wp_enqueue_scripts` so it loads before
 * Free's default-priority enqueue, ensuring its DOMContentLoaded
 * listener attaches first.
 *
 * @package she-header
 * @since   2.2.0
 */

( function () {
	'use strict';

	function strip() {
		var failed = document.querySelectorAll(
			'[data-she-dc-status="fail"].she-header-yes'
		);
		failed.forEach( function ( el ) {
			el.classList.remove( 'she-header-yes' );
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', strip );
	} else {
		strip();
	}
} )();
