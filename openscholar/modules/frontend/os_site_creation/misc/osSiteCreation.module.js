(function () {

  var m = angular.module('SiteCreationForm', ['angularModalService', 'ngMessages'])
  .config(function (){
    rootPath = Drupal.settings.paths.siteCreationModuleRoot;
    paths = Drupal.settings.paths
  });

  m.controller('siteCreationCtrl', function($scope, $http, $rootScope) {

  //Set default value for vsite
  $scope.vsite = {
    value: '0'
  };

  //Toggle open/close for 'who can view your site'
  $scope.showAll = false;
  $scope.toggleFunc = function() {
    $scope.showAll = !$scope.showAll;
  };

  //Reset value for other 'Type of site' based on selection
  $scope.clearRest = function(field) {
    if (field != 'individualScholar') {
      $scope.individualScholar = null;
    }
    if (field != 'projectLabSmallGroup') {
      $scope.projectLabSmallGroup = null;
    }
    if (field != 'departmentSchool') {
      $scope.departmentSchool = null;
    }
  }

  //Set status of next button to disabled initially
  $scope.btnDisable = true;

  //Navigate between screens
  $scope.page1 = true;
  $scope.navigatePage = function(pagefrom, pageto) {
    $scope[pagefrom] = false;
    $scope[pageto] = true;
  }

  //Set default value for Content Option
  $scope.contentOption = {
    value: 'os_department_minimal',
  };

  //Site URL
  $scope.baseURL = Drupal.settings.admin_panel.purl_base_domain + '/';

  //Get all values and save them in localstorage for use
  $scope.saveAllValues = function() {
    var formdata = {};
    formdata = {
      individualScholar: $scope.individualScholar,
      projectLabSmallGroup: $scope.projectLabSmallGroup,
      departmentSchool: $scope.departmentSchool,
      vsite: $scope.vsite.value,
      contentOption: $scope.contentOption.value,
     };

    // Get sub site parent id
    if (typeof $rootScope.siteCreationFormId !== 'undefined') {
      var splitId = $rootScope.siteCreationFormId.split('add-subsite-');
      if (splitId.length > 1) {
        formdata['parent'] = splitId[1];
      }
    }

    $scope.btnDisable = true;
    //Ajax call to save formdata
    $http.post(paths.api + '/purl', formdata).then(function (response) {
      $scope.successData = response.data;
    });
  }
});
  /**
   * Open modals for the site creation forms
   */
  m.directive('siteCreationForm', ['ModalService','$rootScope', function (ModalService,$rootScope) {
    var dialogOptions = {
      minWidth: 900,
      minHeight: 300,
      modal: true,
      position: 'center',
      dialogClass: 'site-creation-form'
    };

    function link(scope, elem, attrs) {
		
      elem.bind('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $rootScope.siteCreationFormId = attrs.id;

        ModalService.showModal({
          controller: 'siteCreationCtrl',
          templateUrl: rootPath + '/templates/os_site_creation.html',
          inputs: {
            form: scope.form
          }
        })
        .then(function (modal) {
          dialogOptions.title = scope.title;
          dialogOptions.close = function (event, ui) {
            modal.element.remove();
          }
          modal.element.dialog(dialogOptions);
          modal.close.then(function (result) {
            if (result) {
              window.location.reload();
            }
          });
        });
      });
    }

    return {
      link: link,
      scope: {
        form: '@'
      }
    };
  }]);

//Validate form for existing site names
  m.directive('formcheckDirective', ['$http', function($http) {
  var responseData;
  return {
    require: 'ngModel',
    link: function(scope, element, attr, siteCreationCtrl) {
      function formValidation(ngModelValue) {
        siteCreationCtrl.$setValidity('isinvalid', true);
        siteCreationCtrl.$setValidity('sitename', true);
        scope.btnDisable = true;
        if(ngModelValue){
          //Ajax call to get all existing sites
          $http({
            method : "GET",
            url :  paths.api + '/purl/' + ngModelValue,
          }).then(function mySuccess(response) {
            responseData = response.data.data;
            if (responseData == "Invalid"){
              siteCreationCtrl.$setValidity('sitename', true);
              siteCreationCtrl.$setValidity('isinvalid', false);
            }
            else if (responseData == "Not-Available") {
              siteCreationCtrl.$setValidity('isinvalid', true);
              siteCreationCtrl.$setValidity('sitename', false);
            }
            else{
              siteCreationCtrl.$setValidity('isinvalid', true);
              siteCreationCtrl.$setValidity('sitename', true);
              scope.btnDisable = false;
            }
          });
        }
        return ngModelValue;
      }
      siteCreationCtrl.$parsers.push(formValidation);
    }
  };
}]);

})()
