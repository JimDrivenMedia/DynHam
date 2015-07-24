$( document ).on( "pagecontainerbeforechange", function( event, ui ) {
    onDeviceReady();
    handleExternalURLs();
    
} );
$(document).on('pagebeforeshow', '#news', function (e, data) {
    $('#news .iscroll-content').rssfeed('http://students.hamilton.edu/rss/articles.cfm?item=A9AAF6B5-FB82-2ADF-26A75A82CDDD1221', {
            limit: 10,
            linktarget: '_blank',
            header: false
          }, writeClass);
}); 

$(document).on('pageshow', '#map', function (e, data) {
    setTimeout(function () {
        $.getScript( "js/campus.map.js", function( data, textStatus, jqxhr ) {
        });
    }, 100);
}); 
writeClass =  function() {
    $( "h4 a" ).addClass( "external" );
     $('#news .iscroll-content').attr("style", "");
    $('.newsholder').iscrollview('refresh');
}
$(document).on('pageshow', '#phonenums', function (e, data) {
    // this won't work need to check to see if there is a db if not then load it if yes then show it.
    db = window.openDatabase("pagesDB", "1.0", "HamiltonCollege", 200000);
    db.transaction(getNumbers, db_error);
}); 

//document.addEventListener('deviceready', onDeviceReady, false);


function onDeviceReady() {
    // Mock device.platform property if not available
    if (!window.device) {
        window.device = { platform: 'Browser' };
    }
    handleExternalURLs();
}
$(function() {
    FastClick.attach(document.body);
});

function handleExternalURLs() {
    // Handle click events for all external URLs
    if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, { openExternal: true });
            e.preventDefault();
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_blank');
            alert('clicked a link');
            e.preventDefault();
        });
    }
    else {
       
    }
}
/* VERSION CHECKS */

/* Check to see if versions are present if not create DB */
function contentChecks(){
        var todayDate = moment().format();
        var uuid = guid();
        db = window.openDatabase("pagesDB", "1.0", "PhoneGap Demo", 200000);
        db.transaction(function (tx) {  
	       var sql = 
            "CREATE TABLE IF NOT EXISTS versionchecks ( "+
            "id varchar(50) PRIMARY KEY, " +
            "vieweraudience VARCHAR(255), " +
            "contentsection VARCHAR(255), " + // phonenumbers, content, dininghall, map
            "versionnumber integer)";
            tx.executeSql(sql);
            console.log('added versionchecks');
            tx.executeSql('INSERT INTO versionchecks (id,vieweraudience,contentsection,1) VALUES (?,?,?,?)',[uuid,'S', '','1']);
            console.log('added contentchecks data');
        });

}
/* Check to see if version is Stale */
/* Pull full JSON Feed */
/* insert feed parts in to dbs and update accordingly */
