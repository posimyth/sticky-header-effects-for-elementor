<?php
/**
 * Display Condition Resolver.
 *
 * Pure rule-matching logic. Stateless except for a static per-request
 * cache so that multiple sticky sections on the same page don't re-evaluate
 * identical rules.
 *
 * Sprint 4 rule types:
 *   - site         : matches everything
 *   - front        : front page
 *   - posts_page   : blog/posts page (when a separate Posts Page is set)
 *   - 404          : not-found page
 *   - search       : search results
 *   - specific     : matches if current post ID is in a selected list
 *   - post_type    : matches when viewing a singular of this post type
 *
 * Sprint 5 rule types:
 *   - taxonomy     : matches on an archive of a given taxonomy
 *   - term         : matches on a specific term archive OR on a singular post
 *                    that has the term assigned (handles both contexts)
 *   - logged_in    : matches when current user is logged in
 *   - logged_out   : matches when current user is not logged in
 *   - role         : matches if current user has any of the selected roles
 *   - url_contains : matches if REQUEST_URI contains the substring (case-insensitive)
 *   - archive      : matches any archive page
 *   - author       : matches author archive
 *
 * Extension point: filter `she_display_condition_match` is still available
 * for third-party / future custom rule types.
 *
 * @package she-header
 * @since   2.2.0
 */

namespace SheHeader\Modules\DisplayCondition;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Resolver.
 */
class Resolver {

	/**
	 * Per-request memoization of rule evaluations.
	 *
	 * @var array<string, bool>
	 */
	private static $cache = array();

	/**
	 * Return true if ANY rule in the array matches the current request.
	 *
	 * @param array $rules Repeater rows from the section's settings.
	 * @return bool
	 */
	public static function matches_any( array $rules ) {
		foreach ( $rules as $rule ) {
			if ( ! is_array( $rule ) ) {
				continue;
			}
			if ( self::matches_rule( $rule ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Evaluate a single rule row.
	 *
	 * @param array $rule One repeater row.
	 * @return bool
	 */
	private static function matches_rule( array $rule ) {
		$type = isset( $rule['she_dc_type'] ) ? (string) $rule['she_dc_type'] : '';
		if ( '' === $type ) {
			return false;
		}

		$cache_key = self::cache_key( $rule );
		if ( isset( self::$cache[ $cache_key ] ) ) {
			return self::$cache[ $cache_key ];
		}

		$result = false;

		switch ( $type ) {
			case 'site':
				$result = true;
				break;

			case 'front':
				$result = is_front_page();
				break;

			case 'posts_page':
				$result = is_home() && ! is_front_page();
				break;

			case '404':
				$result = is_404();
				break;

			case 'search':
				$result = is_search();
				break;

			case 'specific':
				$result = self::match_specific( $rule );
				break;

			case 'post_type':
				$result = self::match_post_type( $rule );
				break;

			case 'taxonomy':
				$result = self::match_taxonomy( $rule );
				break;

			case 'term':
				$result = self::match_term( $rule );
				break;

			case 'logged_in':
				$result = is_user_logged_in();
				break;

			case 'logged_out':
				$result = ! is_user_logged_in();
				break;

			case 'role':
				$result = self::match_role( $rule );
				break;

			case 'url_contains':
				$result = self::match_url_contains( $rule );
				break;

			case 'archive':
				$result = is_archive();
				break;

			case 'author':
				$result = is_author();
				break;

			default:
				// Allow Sprint 5 + future custom types to extend.
				$result = (bool) apply_filters(
					'she_display_condition_match',
					false,
					$type,
					$rule
				);
				break;
		}

		self::$cache[ $cache_key ] = $result;
		return $result;
	}

	/**
	 * Match current request against a list of specific post/page IDs.
	 *
	 * SELECT2 multi-values may arrive as array or comma-separated string —
	 * normalize both.
	 *
	 * @param array $rule
	 * @return bool
	 */
	private static function match_specific( array $rule ) {
		if ( ! is_singular() ) {
			return false;
		}

		$ids = isset( $rule['she_dc_specific'] ) ? $rule['she_dc_specific'] : array();
		if ( is_string( $ids ) ) {
			$ids = array_filter( array_map( 'trim', explode( ',', $ids ) ) );
		}
		$ids = array_map( 'intval', (array) $ids );
		if ( empty( $ids ) ) {
			return false;
		}

		return in_array( (int) get_the_ID(), $ids, true );
	}

	/**
	 * Match current request against a singular of a given post type.
	 *
	 * @param array $rule
	 * @return bool
	 */
	private static function match_post_type( array $rule ) {
		$post_type = isset( $rule['she_dc_post_type'] ) ? (string) $rule['she_dc_post_type'] : '';
		if ( '' === $post_type ) {
			return false;
		}
		return is_singular( $post_type );
	}

	/**
	 * Match a taxonomy-archive request.
	 *
	 * `is_tax()` returns false for the built-in `category` and `post_tag`
	 * taxonomies, so we route those through `is_category()` / `is_tag()`.
	 *
	 * @param array $rule
	 * @return bool
	 */
	private static function match_taxonomy( array $rule ) {
		$tax = isset( $rule['she_dc_taxonomy'] ) ? (string) $rule['she_dc_taxonomy'] : '';
		if ( '' === $tax ) {
			return false;
		}
		if ( 'category' === $tax ) {
			return is_category();
		}
		if ( 'post_tag' === $tax ) {
			return is_tag();
		}
		return is_tax( $tax );
	}

	/**
	 * Match a specific term — either on its archive page OR on a singular
	 * post that has the term assigned (most common use case for sticky
	 * targeting).
	 *
	 * Values arrive as an array of "taxonomy:term_id" strings (or as a
	 * comma-separated string from older Elementor SELECT2 versions).
	 *
	 * @param array $rule
	 * @return bool
	 */
	private static function match_term( array $rule ) {
		$values = isset( $rule['she_dc_term'] ) ? $rule['she_dc_term'] : array();
		if ( is_string( $values ) ) {
			$values = array_filter( array_map( 'trim', explode( ',', $values ) ) );
		}
		$values = (array) $values;
		if ( empty( $values ) ) {
			return false;
		}

		foreach ( $values as $value ) {
			if ( strpos( (string) $value, ':' ) === false ) {
				continue;
			}
			list( $tax, $term_id ) = explode( ':', (string) $value, 2 );
			$term_id = (int) $term_id;
			if ( '' === $tax || $term_id <= 0 ) {
				continue;
			}

			// Archive context.
			if ( 'category' === $tax && is_category( $term_id ) ) {
				return true;
			}
			if ( 'post_tag' === $tax && is_tag( $term_id ) ) {
				return true;
			}
			if ( is_tax( $tax, $term_id ) ) {
				return true;
			}

			// Singular context — post has this term assigned.
			if ( is_singular() && has_term( $term_id, $tax, get_the_ID() ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Match current user against a list of roles.
	 *
	 * @param array $rule
	 * @return bool
	 */
	private static function match_role( array $rule ) {
		if ( ! is_user_logged_in() ) {
			return false;
		}

		$roles = isset( $rule['she_dc_role'] ) ? $rule['she_dc_role'] : array();
		if ( is_string( $roles ) ) {
			$roles = array_filter( array_map( 'trim', explode( ',', $roles ) ) );
		}
		$roles = (array) $roles;
		if ( empty( $roles ) ) {
			return false;
		}

		$user       = wp_get_current_user();
		$user_roles = (array) $user->roles;

		foreach ( $roles as $role ) {
			if ( in_array( $role, $user_roles, true ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Match REQUEST_URI against a case-insensitive substring.
	 *
	 * Includes query string. Decodes percent-encoded characters so the
	 * needle "café" matches "/caf%C3%A9-menu/".
	 *
	 * @param array $rule
	 * @return bool
	 */
	private static function match_url_contains( array $rule ) {
		$needle = isset( $rule['she_dc_url'] ) ? trim( (string) $rule['she_dc_url'] ) : '';
		if ( '' === $needle ) {
			return false;
		}

		$haystack = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( $_SERVER['REQUEST_URI'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$haystack = (string) urldecode( (string) $haystack );

		return false !== stripos( $haystack, $needle );
	}

	/**
	 * Build a deterministic cache key for a rule row.
	 *
	 * @param array $rule
	 * @return string
	 */
	private static function cache_key( array $rule ) {
		// Strip Elementor's internal repeater id so equivalent rules collapse.
		unset( $rule['_id'] );
		return md5( (string) wp_json_encode( $rule ) );
	}

	/**
	 * Clear the cache. Intended for tests; not used in production.
	 *
	 * @return void
	 */
	public static function reset_cache() {
		self::$cache = array();
	}
}
