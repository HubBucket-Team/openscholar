<?php

/**
 * @file
 * Contains \RestfulDataProviderDbQuery
 */

class OsRestfulThemes extends \RestfulBase implements \RestfulDataProviderInterface {

  /**
   * Overrides \RestfulBase::controllersInfo().
   */
  public static function controllersInfo() {
    return array(
      '^.*$' => array(
        \RestfulInterface::GET => 'getThemes',
      ),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function publicFieldsInfo() {
     return array();
  }

  /**
   * Get content type options.
   */
  public function getThemes() {
    ctools_include('themes', 'os');
    $themes = os_get_themes();
    ksort($themes);
    $others = array();
    $single = array();
    $featured = array();
    $default_flavor = '';

    $featured_themes = array_filter(variable_get('cp_appearance_featured_themes', array('aberdeen' => 'aberdeen', 'airstream' => 'airstream')));
    foreach ($themes as $theme) {
      $info = $theme->info;
      $info['theme_name'] = $theme->name;
      if (!in_array($theme->name, $featured_themes) && empty($theme->info['single'])) {
        $theme_flavors = os_theme_get_flavors($info['theme_name']);
        $flavor = _cp_appearance_get_flavor_options($theme_flavors, $info, $default_flavor);
        $flavor_options = array();
        if (!empty($flavor)) {
          foreach ($flavor as $key => $value) {
            $flavor_options[] = array('key' => $key, 'name' => $value);
          }
        }

        $others[] = array('name' => $info['name'],
          'themeKey' => $info['theme_name'],
          'screenshot' => $info['screenshot'],
          'flavorName' => $info['flavor_name'],
          'flavorOptions' => $flavor_options,
        );

      }
      else {
        if (!empty($info['single'])) {
          $name  = !empty($info['flavor_name']) ? $info['flavor_name'] : $info['name'];
          $single[] = array('name' => $name,
            'themeKey' => $info['theme_name'].'-os_featured_flavor-default',
            'screenshot' => $info['screenshot'],
            'flavorName' => $info['flavor_name'],
            'flavorOptions' => '',
          );

          $flavors = os_theme_get_flavors($info['theme_name']);
           foreach ($flavors as $flavor_name => $flav) {
            $flavor_theme->info['screenshot'] = $flav['path'].'/screenshot.png';
            $single[] = array('name' => $flav['name'],
              'themeKey' => $info['theme_name'].'-os_featured_flavor-'.$flavor_name,
              'screenshot' => $flav['path'].'/screenshot.png',
              'flavorName' => $flav['name'],
              'flavorOptions' => '',
            );
          }
        }
        else {
          $name  = !empty($info['flavor_name']) ? $info['flavor_name'] : $info['name'];
          $featured[] = array('name' => $name,
            'themeKey' => $info['theme_name'].'-os_featured_flavor-default',
            'screenshot' => $info['screenshot'],
            'flavorName' => $info['flavor_name'],
            'flavorOptions' => '',
          );

          $flavors = os_theme_get_flavors($info['theme_name']);
           foreach ($flavors as $flavor_name => $flav) {
            $flavor_theme->info['screenshot'] = $flav['path'].'/screenshot.png';
            $featured[] = array('name' => $flav['name'],
              'themeKey' => $info['theme_name'].'-os_featured_flavor-'.$flavor_name,
              'screenshot' => $flav['path'].'/screenshot.png',
              'flavorName' => $flav['name'],
              'flavorOptions' => '',
            );
          }
        }
      }
    }

    return array('single'=> $single, 'featured' => $featured, 'others' => $others);

  }
}
