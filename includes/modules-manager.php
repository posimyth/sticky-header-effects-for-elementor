<?php
namespace SheHeader;

use SheHeader\Base\Module_Base;

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

final class Manager {
	/**
	 * @var Module_Base[]
	 */
	private $modules = [];

	public function __construct() {
		// Free plugin loads ONLY its own `transparent` module here.
		//
		// The Pro feature modules still physically live in this plugin's
		// `modules/<feature>/` folders, but they are no longer registered
		// here. They are instantiated by the separate
		// "Sticky Header Effects for Elementor Pro" plugin when it is
		// active (see that plugin's includes/class-pro-manager.php). With
		// the Pro plugin inactive, these features simply do not load.
		$modules = [
			'transparent',
			'pro-upsell',
		];

		foreach ( $modules as $module_name ) {
			$class_name = str_replace( '-', ' ', $module_name );

			$class_name = str_replace( ' ', '', ucwords( $class_name ) );

			$class_name = __NAMESPACE__ . '\\Modules\\' . $class_name . '\Module';

			/** @var Module_Base $class_name */
			if ( $class_name::is_active() ) {
				$this->modules[ $module_name ] = $class_name::instance();
			}
		}
	}

	/**
	 * @param string $module_name
	 *
	 * @return Module_Base|Module_Base[]
	 */
	public function get_modules( $module_name ) {
		if ( $module_name ) {
			if ( isset( $this->modules[ $module_name ] ) ) {
				return $this->modules[ $module_name ];
			}

			return null;
		}

		return $this->modules;
	}
}
