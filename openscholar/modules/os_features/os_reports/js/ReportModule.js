(function () {
  var reportModule = angular.module('ReportModule', ['os-auth']);
  reportModule.controller('SiteReportQuery', ['$sce', '$http', '$scope', function ($sce, $http, $scope) {
    $scope.params = {};
    $scope.params.includesites = 'content';
    $scope.report_url = 'report_sites';

    $scope.headerConversion = {
      'site_name' : {
        'display' : 'site title',
      },
      'owner_email' : {
        'display' : 'site owner email',
      },
      'install' : {
        'display' : 'os install',
      },
      'subdomain' : {
        'display' : 'owner subdomain',
      },
      'created' : {
        'display' : 'site created',
      },
      'created_by' : {
        'display' : 'site created by',
      },
      'privacy' : {
        'display' : 'site privacy setting',
      },
      'domain' : {
        'display' : 'custom domain',
      },
      'custom_theme' : {
        'display' : 'custom theme',
      },
      'changed' : {
        'display' : 'content last updated',
      },
      'preset' : {
        'display' : 'site preset',
      },
    };

    $scope.pager = function($direction) {
      var url = '';
      eval ('url = $scope.' + $direction + ';');
      $scope.params = convertRestURLtoObj(url);
      $scope.update();
    }

    $scope.updateCheckedValues = function updateCheckedValues($set, $value) {
      if (eval("!$scope.queryform." + $set)) {
        eval ("$scope.queryform." + $set + " = {};");
      }
      $checked = eval("$scope.queryform." + $set + "." + $value);

      if ($checked && !$scope.params[$set]) {
        $scope.params[$set] = $value;
      }
      else {
        $valueArray = new Array();
        for ($key in $scope.queryform[$set]) {
          if ($scope.queryform[$set][$key]) {
            $valueArray.push($key);
          }
        }
        $scope.params[$set] = $valueArray;
        if ($scope.params[$set].length == 0) {
          delete $scope.params[$set];
        }
      }

      // reset to page 1 and no sort
      $scope.params.page = '1';
      $scope.params.sort = "";
    };

    $scope.setContentOptions = function setContentOptions($fieldname) {
      $value = eval('$scope.params.' + $fieldname);
      if (($fieldname == "changed" && $scope.queryform.columns.changed) || ($fieldname == 'lastupdatebefore' && $value)) {
        jQuery("input[value='all']").attr('disabled','disabled');
        jQuery("input[value='nocontent']").attr('disabled','disabled');
        $scope.params.includesites = 'content';
      }
      else if ($fieldname == "changed" || $fieldname == 'lastupdatebefore') {
        jQuery("input[value='all']").removeAttr('disabled');
        jQuery("input[value='nocontent']").removeAttr('disabled');
        jQuery("input[value='changed']").removeAttr('disabled');
      }
      else if ($fieldname == "includesites" && $value != "content") {
        jQuery("input[name='lastupdatebefore']").attr('disabled','disabled');
        jQuery("input[value='changed']").attr('disabled','disabled');
        $scope.queryform.columns.changed = false;
      }
      else if ($fieldname == "includesites") {
        jQuery("input[name='lastupdatebefore']").removeAttr('disabled');
        jQuery("input[value='changed']").removeAttr('disabled');
      }
    };

    $scope.update = function update() {
      // make sure request isn't already in process
      if (!jQuery("div.results").attr("style")) {
        // reset values
        $scope.headers = [];
        $scope.rows = [];
        jQuery("div.results").css("background-image", "url('/profiles/openscholar/modules/frontend/os_common/FileEditor/large-spin_loader.gif')");
        jQuery(".pager a").hide();
        $scope.status = "";
        jQuery("div#page #messages").remove();

        $scope.params.exclude = ['feed_importer', 'profile', 'harvard_course'];

        var $request = {
          method: 'POST',
          url : Drupal.settings.paths.api + '/' + $scope.report_url,
          headers : {'Content-Type' : 'application/json'},
          data : $scope.params,
        };

        $http($request).then(function($response) {
          if(!$response.data.data) {
            jQuery("div#page").prepend('<div id="messages"><div class="messages error">' + jQuery($response.data).text() + '</div></div>');
            jQuery("div.results").attr("style", "");
          }
          else {
            var $responseData = angular.fromJson($response.data.data);

            $scope.total = $response.data.count;

            if ($response.data.next != null) {
              $scope.next = $response.data.next.href;
              jQuery(".pager .next a").show();
            }
            else {
              $scope.next = null;
              jQuery(".pager .next a").hide();
            }

            if ($response.data.previous != null) {
              $scope.previous = $response.data.previous.href;
              jQuery(".pager .previous a").show();
            }
            else {
              $scope.previous = null;
              jQuery(".pager .previous a").hide();
            }

            var $keys = [];

            // get table headers from returned data
            for ($key in $responseData[0]) {
              if ($key && $key != "site_url") {
                $scope.headers.push($key);
              }
            }
            jQuery("div.results").attr("style", "");
            $scope.rows = $responseData;

            if (!$scope.params || !$scope.params.page) {
              $scope.params.page = 1;
            }

            if (($scope.params.page * $scope.params.range) < $scope.total) {
              $end = ($scope.params.page * $scope.params.range);
            }
            else {
              $end = $scope.total;
            }

            if ($scope.total) {
              $scope.status = "showing " + ((($scope.params.page - 1) * $scope.params.range) + 1) + " - " + $end + " of " + $scope.total;
            }
            else {
              jQuery("div#page").prepend('<div id="messages"><div class="messages warning">No results in report.</div></div>');
            }
          }
        },
        // error
        function() {
          jQuery("div.results").attr("style", "");
          jQuery("div#page").prepend('<div id="messages"><div class="messages error">An error occurred.</div></div>');
        }
      );
     }
    };

    $scope.reset = function() {
      jQuery("div.results").attr("style", "");
      jQuery("div#page #messages").remove();
      for (var key in $scope.params) {
        if ($scope.params.hasOwnProperty(key) && key != "range") {
          delete $scope.params[key];
        }
      }
      $scope.params.includesites = 'content';
      for (var key in $scope.queryform) {
        delete $scope.queryform[key];
      }
    };

    $scope.sort = function sort($obj) {
      if ($scope.params.sort && ($scope.params.sort == $obj.header)) {
        $scope.params.sort = "-" + $obj.header;
      }
      else if ($scope.params.sort && ($scope.params.sort == "-" + $obj.header)) {
        delete $scope.params.sort;
      }
      else {
        $scope.params.sort = $obj.header;
      }
      // reset to page 1 and update
      $scope.params.page = '1';
      $scope.update();
    };

    $scope.isActive = function isActive($header) {
      if ($scope.params.sort == $header) {
        return "active desc";
      }
      else if ($scope.params.sort == ("-" + $header)) {
        return "active asc";
      }
      else {
        return false;
      }
    };

    $scope.formatHeader = function formatHeader($header) {
      if ($scope.headerConversion[$header]) {
        return $sce.trustAsHtml($scope.headerConversion[$header]['display']);
      }
      else {
        return $sce.trustAsHtml($header);
      }
    };
  }]);

  reportModule.filter('makelink', ['$sce', function($sce) {
    return function($value, $header, $row) {
      if ($header == "site_name" && $value) {
        $html = '<a href="' + $row['site_url'] + '" target="_new">' + $value + '</a>'
        return $sce.trustAsHtml($html);
      }
      else if ($header == "site_name") {
        $html = '<a href="' + $row['site_url'] + '" target="_new">[No Title]</a>'
        return $sce.trustAsHtml($html);
      }
      else {
        return $sce.trustAsHtml($value);
      }
    };
  }]);

  // function to take URL and return a javascript object of the query string
  var convertRestURLtoObj = function (url) {
      var query = decodeURIComponent(url.split('?').slice(1).toString());
      $queryArray = query.split('&');
      $queryObj = new Object();

      jQuery.each($queryArray, function($key, $value) {
        $pair = $value.split('=');
        $arrayFlag = 0;
        if ($pair[0].match(/\[\d+\]/)) {
          $arrayFlag = 1;
          $pair[0] = $pair[0].replace(/\[\d+\]/g, '');
        }
        if ($queryObj[$pair[0]]) {
          if (typeof $queryObj[$pair[0]] === "string") {
            $queryObj[$pair[0]] = new Array($queryObj[$pair[0]], $pair[1]);
          }
          else {
            $queryObj[$pair[0]].push($pair[1]);
          }
        }
        else {
          if ($arrayFlag) {
            $queryObj[$pair[0]] = new Array($pair[1]);
          }
          else {
            $queryObj[$pair[0]] = $pair[1];
          }
        }
      });

      return $queryObj;
  };


})();
