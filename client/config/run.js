'use strict';

app.run(runBlock);

runBlock.$inject = ["$rootScope"];


/* @ngInject */
function runBlock($rootScope) {
    $rootScope.$on('$stateChangeStart', onStateChangeStart);
    $rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

    function onStateChangeStart(event, curr, prev) {}

    function onStateChangeSuccess(e, curr, prev) {

    }
}