/**
 * Multi-Sticky Coordinator (rebuild v6 — pure JS scroll control).
 *
 * Why this approach:
 *   Previous versions used native `position: sticky` for the browser to
 *   handle stickiness. That worked in isolation but had unpredictable
 *   interactions with Elementor's CSS and Theme Builder `<header>`
 *   wrappers — containers would sometimes stick too early or not at all.
 *
 *   This version takes full deterministic control via JS. Each container
 *   is in normal flow by default; we make it `position: fixed` ONLY when
 *   we explicitly decide it should be sticky, based on the user's scroll
 *   position vs. the container's natural document Y position.
 *
 * Architecture:
 *   - Each container's natural Y position is measured from its placeholder
 *     when fixed, or from itself when in flow. Re-measured on every scroll
 *     — for BOTH in-flow AND fixed entries — to handle layout shifts (lazy
 *     images, fonts loading, etc.). Re-measuring fixed entries is what lets
 *     a container that activated too early (because content above it had not
 *     loaded yet) self-correct and release once the layout settles.
 *
 *   - OVERRIDE: a container may declare an explicit activation scroll
 *     distance (`data-she-multi-activate-at[-tablet|-mobile]`). When present,
 *     that exact pixel value is used as the activation point and measurement
 *     is skipped entirely — a deterministic escape hatch for pages where
 *     automatic measurement is unreliable.
 *
 *   - STACK MODE (Accumulating): container i becomes fixed at the
 *     cumulative top of the stack when its natural Y reaches the bottom
 *     of the currently-active stack above. Until then, it stays in
 *     normal flow at its natural mid-page position.
 *
 *   - SEQUENTIAL MODE: only one container is active at any moment. The
 *     active one is the highest-index entry whose natural Y has been
 *     scrolled past. Previously-active containers (idx < activeIdx) are
 *     hidden. Not-yet-reached containers (idx > activeIdx) stay in flow.
 *
 * No dependency on:
 *   - Browser's `position: sticky` (avoid Elementor CSS interference)
 *   - `:has()` CSS selector (works in older browsers too)
 *   - IntersectionObserver (used scroll listener instead for direct control)
 *   - Theme Builder `<header>` wrapper behavior
 *
 * @package she-header
 * @since   2.2.10
 */

( function () {
	'use strict';

	var MAX_CONTAINERS =
		( window.SheMultiStickyConfig && window.SheMultiStickyConfig.maxContainers )
			? parseInt( window.SheMultiStickyConfig.maxContainers, 10 )
			: 5;

	// Enable visual debug overlay by adding `?she_debug=1` to the URL.
	var DEBUG = window.location.search.indexOf( 'she_debug=1' ) !== -1;
	var debugBox = null;

	/** @type {Array} */
	var entries = [];
	var groupMode = 'stack';
	var scrollTicking = false;
	var lastActiveIndex = -1;

	function init() {
		var nodes = document.querySelectorAll( '[data-she-multi-mode]' );
		if ( nodes.length < 1 ) {
			return;
		}

		// Build + sort by priority.
		var sortable = Array.prototype.slice.call( nodes ).map( function ( el ) {
			return {
				el: el,
				priority: parseInt(
					el.getAttribute( 'data-she-multi-priority' ) || '0',
					10
				) || 0,
				mode: el.getAttribute( 'data-she-multi-mode' ) || 'stack',
			};
		} );
		sortable.sort( function ( a, b ) {
			return a.priority - b.priority;
		} );

		if ( sortable.length > MAX_CONTAINERS ) {
			if ( window.console && console.warn ) {
				console.warn(
					'[Multi-Sticky] ' + sortable.length +
					' containers found; max ' + MAX_CONTAINERS +
					'. Using first ' + MAX_CONTAINERS + ' by Priority.'
				);
			}
			sortable = sortable.slice( 0, MAX_CONTAINERS );
		}

		groupMode = sortable[ sortable.length - 1 ].mode;

		// Build entries WITHOUT making anything fixed yet — let the
		// initial recompute decide based on scroll position.
		sortable.forEach( function ( s ) {
			var rect = s.el.getBoundingClientRect();
			var naturalY = rect.top + ( window.scrollY || window.pageYOffset || 0 );
			var height = s.el.offsetHeight || 0;

			// Pre-create the placeholder (not yet inserted).
			var placeholder = document.createElement( 'div' );
			placeholder.className = 'she-multi-placeholder';
			placeholder.setAttribute( 'aria-hidden', 'true' );

			entries.push( {
				el: s.el,
				placeholder: placeholder,
				mode: s.mode,
				priority: s.priority,
				naturalY: naturalY,
				height: height,
				isFixed: false,
				// Explicit activation scroll distance (px) or null for auto.
				// Re-resolved on resize because the value is responsive.
				activateAt: readActivateOverride( s.el ),
			} );
		} );

		// Build debug overlay if requested.
		if ( DEBUG ) {
			createDebugOverlay();
		}

		// Initial recompute.
		recompute();

		// Listeners.
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		window.addEventListener( 'resize', onResize, { passive: true } );
		window.addEventListener( 'load', onLoadRefresh );

		// Observe heights changing (Free's Shrink Header, lazy content).
		if ( typeof window.ResizeObserver !== 'undefined' ) {
			var ro = new ResizeObserver( function () {
				reMeasureAll();
				recompute();
			} );
			entries.forEach( function ( entry ) {
				ro.observe( entry.el );
			} );
		}
	}

	/**
	 * Measure natural document Y of an entry. Uses the placeholder if
	 * the entry is currently fixed (placeholder stays in flow at the
	 * entry's original position), otherwise measures from the element
	 * itself (it's in normal flow).
	 */
	function measureNaturalY( entry ) {
		var target = entry.isFixed ? entry.placeholder : entry.el;
		if ( ! target || ! target.parentNode ) {
			return entry.naturalY || 0;
		}
		var rect = target.getBoundingClientRect();
		return rect.top + ( window.scrollY || window.pageYOffset || 0 );
	}

	function reMeasureAll() {
		entries.forEach( function ( entry ) {
			entry.height = entry.el.offsetHeight || entry.height;
			if ( entry.activateAt === null ) {
				entry.naturalY = measureNaturalY( entry );
			}
		} );
	}

	/**
	 * Read the explicit activation scroll-distance override for an element,
	 * picking the value for the current viewport (mobile / tablet / desktop).
	 * Device-specific values fall back to the desktop/base value when blank.
	 *
	 * @param {HTMLElement} el
	 * @return {number|null} Pixel value, or null when no override is set.
	 */
	function readActivateOverride( el ) {
		var w = window.innerWidth;
		var attr = null;

		// Elementor default breakpoints: mobile <= 767, tablet <= 1024.
		if ( w <= 767 ) {
			attr = el.getAttribute( 'data-she-multi-activate-at-mobile' );
		} else if ( w <= 1024 ) {
			attr = el.getAttribute( 'data-she-multi-activate-at-tablet' );
		}
		if ( attr === null || attr === '' ) {
			attr = el.getAttribute( 'data-she-multi-activate-at' );
		}
		if ( attr === null || attr === '' ) {
			return null;
		}
		var n = parseInt( attr, 10 );
		return isNaN( n ) ? null : n;
	}

	/**
	 * The Y value used for activation decisions: the explicit override when
	 * present, otherwise the measured natural document position.
	 *
	 * @param {Object} entry
	 * @return {number}
	 */
	function effectiveY( entry ) {
		return ( entry.activateAt !== null && entry.activateAt !== undefined )
			? entry.activateAt
			: entry.naturalY;
	}

	function ensureFixed( entry, topPx ) {
		if ( ! entry.isFixed ) {
			// Capture current viewport position BEFORE going fixed —
			// this is the element's visual starting point for the slide-in.
			var currentViewportTop = entry.el.getBoundingClientRect().top;

			// Capture height before going fixed (so placeholder matches).
			entry.height = entry.el.offsetHeight || entry.height;
			entry.placeholder.style.height = entry.height + 'px';
			if ( entry.el.parentNode ) {
				entry.el.parentNode.insertBefore( entry.placeholder, entry.el );
			}
			entry.el.classList.add( 'she-multi-fixed' );
			entry.isFixed = true;

			// Slide-in animation:
			// 1. Place the element at its current viewport position (no
			//    transition enabled yet, so this is an instant paint).
			entry.el.style.setProperty( 'top', currentViewportTop + 'px', 'important' );
			// 2. Force the browser to flush the style so it registers
			//    currentViewportTop as the animation "from" value.
			void entry.el.offsetHeight;
			// 3. Enable the top transition via the entering class, then
			//    set the target — browser animates from current → target.
			entry.el.classList.add( 'she-multi-entering' );
			entry.el.style.setProperty( 'top', topPx + 'px', 'important' );
			// 4. Remove the entering class after the transition finishes
			//    so subsequent top updates are instant (no lag on scroll).
			var el = entry.el;
			setTimeout( function () {
				el.classList.remove( 'she-multi-entering' );
			}, 400 );
			return;
		}
		// Already fixed — update top immediately, no animation.
		entry.el.style.setProperty( 'top', topPx + 'px', 'important' );
	}

	function ensureNormalFlow( entry ) {
		if ( ! entry.isFixed ) {
			return;
		}
		if ( entry.placeholder.parentNode ) {
			entry.placeholder.parentNode.removeChild( entry.placeholder );
		}
		entry.el.classList.remove( 'she-multi-fixed' );
		entry.el.classList.remove( 'she-multi-hidden' );
		entry.el.classList.remove( 'she-multi-entering' );
		entry.el.style.removeProperty( 'top' );
		entry.isFixed = false;
	}

	function onScroll() {
		if ( scrollTicking ) {
			return;
		}
		requestAnimationFrame( function () {
			// Re-measure EVERY entry — including fixed ones, via their
			// placeholder which stays in real flow. This is what lets a
			// container that activated too early (because content above it
			// had not loaded yet, so its natural position was measured too
			// small) self-correct: once the layout settles its naturalY
			// grows past the scroll position and it releases back to flow.
			// Entries with an explicit activation override are left alone.
			entries.forEach( function ( entry ) {
				if ( entry.activateAt === null ) {
					entry.naturalY = measureNaturalY( entry );
				}
			} );
			recompute();
			scrollTicking = false;
		} );
		scrollTicking = true;
	}

	function onResize() {
		// Viewport width may have crossed a breakpoint — re-resolve the
		// responsive activation override before re-measuring.
		entries.forEach( function ( entry ) {
			entry.activateAt = readActivateOverride( entry.el );
		} );
		reMeasureAll();
		recompute();
	}

	function onLoadRefresh() {
		// After all resources (images, fonts) loaded, layout has settled.
		// Re-measure everything from scratch and re-apply.
		// For currently-fixed entries: temporarily revert to flow, measure,
		// then reapply.
		entries.forEach( function ( entry ) {
			ensureNormalFlow( entry );
		} );
		reMeasureAll();
		recompute();
	}

	function getAdminBarOffset() {
		if ( ! document.body.classList.contains( 'admin-bar' ) ) {
			return 0;
		}
		return window.innerWidth <= 782 ? 46 : 32;
	}

	function recompute() {
		if ( ! entries.length ) {
			return;
		}
		var scrollY = window.scrollY || window.pageYOffset || 0;
		var adminBar = getAdminBarOffset();
		var effectiveScroll = scrollY + adminBar;

		if ( groupMode === 'sequential' ) {
			applySequential( effectiveScroll, adminBar );
		} else {
			applyStack( effectiveScroll, adminBar );
		}

		if ( DEBUG ) {
			updateDebugOverlay( scrollY, adminBar );
		}
	}

	/* ----------- Debug overlay (?she_debug=1) ----------- */

	function createDebugOverlay() {
		debugBox = document.createElement( 'div' );
		debugBox.id = 'she-multi-debug';
		debugBox.setAttribute( 'aria-hidden', 'true' );
		debugBox.style.cssText =
			'position:fixed;bottom:10px;right:10px;z-index:2147483647;' +
			'background:rgba(0,0,0,0.85);color:#0f0;font:12px/1.4 monospace;' +
			'padding:10px;border-radius:4px;max-width:400px;pointer-events:none;' +
			'box-shadow:0 2px 8px rgba(0,0,0,0.5);';
		document.body.appendChild( debugBox );
	}

	function updateDebugOverlay( scrollY, adminBar ) {
		if ( ! debugBox ) {
			return;
		}
		var lines = [];
		lines.push( '<b>Multi-Sticky DEBUG (v6)</b>' );
		lines.push( 'Mode: ' + groupMode + ' &nbsp; ScrollY: <b>' + Math.round( scrollY ) + '</b>px &nbsp; AdminBar: ' + adminBar );
		lines.push( '---' );
		entries.forEach( function ( entry, i ) {
			var status = entry.isFixed ? ( entry.el.classList.contains( 'she-multi-hidden' ) ? 'FIXED+HIDDEN' : 'FIXED' ) : 'in-flow';
			var color = entry.isFixed
				? ( entry.el.classList.contains( 'she-multi-hidden' ) ? '#888' : '#0f0' )
				: '#ff0';
			var activateInfo = ( entry.activateAt !== null && entry.activateAt !== undefined )
				? ' <span style="color:#0ff">activateAt=' + entry.activateAt + '(manual)</span>'
				: ' naturalY=<b>' + Math.round( entry.naturalY ) + '</b>';
			lines.push(
				'<span style="color:' + color + '">[#' + i + '] pri=' + entry.priority +
				activateInfo +
				' h=' + entry.height +
				' → ' + status + '</span>'
			);
		} );
		debugBox.innerHTML = lines.join( '<br>' );
	}

	/**
	 * SEQUENTIAL MODE.
	 *
	 * Active container = highest-index entry whose natural Y has been
	 * scrolled past. Previously-active hidden. Future entries in flow.
	 *
	 * If no entry has been reached yet (scroll less than first entry's
	 * natural Y), all entries stay in normal flow.
	 */
	function applySequential( effectiveScroll, adminBar ) {
		var activeIndex = -1;
		entries.forEach( function ( entry, i ) {
			if ( effectiveScroll >= effectiveY( entry ) ) {
				activeIndex = i;
			}
		} );

		entries.forEach( function ( entry, i ) {
			if ( i === activeIndex ) {
				ensureFixed( entry, adminBar );
				entry.el.classList.remove( 'she-multi-hidden' );
			} else if ( i < activeIndex ) {
				// Past — fixed but hidden (placeholder retains layout).
				ensureFixed( entry, adminBar );
				entry.el.classList.add( 'she-multi-hidden' );
			} else {
				// Future or no one active — back to normal flow.
				ensureNormalFlow( entry );
			}
		} );
	}

	/**
	 * STACK MODE (Accumulating).
	 *
	 * Each entry joins the stack at top when its natural Y has been
	 * scrolled past relative to the cumulative height of entries
	 * already in the stack above it.
	 *
	 * Threshold for entry i: scrollY >= naturalY[i] - sum(heights above).
	 *
	 * For entry 0 with naturalY 0 (at top of page), threshold = 0 →
	 * always active. For an entry far down the page, it stays in flow
	 * until its natural top reaches the stack bottom.
	 */
	function applyStack( effectiveScroll, adminBar ) {
		var cumulativeHeight = 0;
		var cumulativeTop = adminBar;

		entries.forEach( function ( entry, i ) {
			var threshold;
			if ( i === 0 ) {
				threshold = effectiveY( entry );
			} else {
				threshold = effectiveY( entry ) - cumulativeHeight;
			}

			if ( effectiveScroll >= threshold ) {
				ensureFixed( entry, cumulativeTop );
				entry.el.classList.remove( 'she-multi-hidden' );
				cumulativeHeight += entry.height;
				cumulativeTop += entry.height;
			} else {
				ensureNormalFlow( entry );
			}
		} );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
