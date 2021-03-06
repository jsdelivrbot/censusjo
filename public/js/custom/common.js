$(window).on('resize orientationchange', function(){
    $("#map").css('min-height',$(window).height() - ($('.wrapper_Top').height() + 60));
});

$(window).load(function () {

    $('#preloader').delay(350).fadeOut(function(){
        $('body').delay(350).css({'overflow':'visible'});
    });

    $("#map").css('min-height',$(window).height() - ($('.wrapper_Top').height() + 60));

    SideNavi.init('right', {
        container: '#sideNavi',
        defaultitem: '.side-navi-item-default',
        item: '.side-navi-item',
        data: '.side-navi-data',
        tab: '.side-navi-tab',
        active: '.active'
    });


    $('.scroll-rightSide ').slimScroll({
        wheelStep: 20,
        height: '530px'
    });

    $('.scroll5').slimScroll({
        wheelStep: 20,
        height: '200px'
    });

    $('.scroll6').slimScroll({
        wheelStep: 20,
        height: ' 530px'
    });

    // Menu Toggle
    $('.menutoggle').click(function () {

        var body = $('body');
        var bodypos = body.css('position');

        if (bodypos != 'relative') {

            if (!body.hasClass('leftpanel-collapsed')) {
                body.addClass('leftpanel-collapsed');
                $('.nav-bracket ul').attr('style', '');

                $(this).addClass('menu-collapsed');

            } else {
                body.removeClass('leftpanel-collapsed chat-view');
                $('.nav-bracket li.active ul').css({display: 'block'});

                $(this).removeClass('menu-collapsed');

            }
        } else {

            if (body.hasClass('leftpanel-show'))
                body.removeClass('leftpanel-show');
            else
                body.addClass('leftpanel-show');

            adjustmainpanelheight();
        }

    });

    detectBrowser();
});

function adjustmainpanelheight() {
    // Adjust mainpanel height
    var docHeight = $(document).height();
    if (docHeight > $('.mainpanel').height())
        $('.mainpanel').height(docHeight);
}

String.prototype.format = function (args) {
    var newStr = this;
    for (var key in args) {
        newStr = newStr.split('{' + key + '}').join(args[key]);
    }
    return newStr;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function GetBaseMapServerUrl() {
    if (portNo)
        return "http://{ServerIP}:{portNo}/arcgis/rest/services/{MapServerName}/MapServer/".format({
            ServerIP: ServerIP,
            portNo: portNo,
            MapServerName: MapServerName
        });
    else {
        return "http://{ServerIP}/arcgis/rest/services/{MapServerName}/MapServer/".format({
            ServerIP: ServerIP,
            MapServerName: MapServerName
        });
    }
}

function GenerateMapServerUrl(id) {
    if (portNo)
        return "http://{ServerIP}:{portNo}/arcgis/rest/services/{MapServerName}/MapServer/{id}".format({
            ServerIP: ServerIP,
            portNo: portNo,
            MapServerName: MapServerName,
            id: id
        });
    else {
        return "http://{ServerIP}/arcgis/rest/services/{MapServerName}/MapServer/{id}".format({
            ServerIP: ServerIP,
            MapServerName: MapServerName,
            id: id
        });
    }
}

function GetGeometryServiceUrl() {
    if (portNo)
        return "http://{ServerIP}:{portNo}/arcgis/rest/services/{GeometryServicePath}".format({
            ServerIP: ServerIP,
            portNo: portNo,
            GeometryServicePath: GeometryServicePath
        });
    else {
        return "http://{ServerIP}/arcgis/rest/services/{GeometryServicePath}".format({
            ServerIP: ServerIP,
            GeometryServicePath: GeometryServicePath
        });
    }
}

function GetPrintTaskUrl() {
    if (portNo)
        return "http://{ServerIP}:{portNo}/arcgis/rest/services/{printTaskServiePath}".format({
            ServerIP: ServerIP,
            portNo: portNo,
            printTaskServiePath: printTaskServiePath
        });
    else {
        return "http://{ServerIP}/arcgis/rest/services/{printTaskServiePath}".format({
            ServerIP: ServerIP,
            printTaskServiePath: printTaskServiePath
        });
    }
}

function getServicesIcons(item) {
    if (!item.id) {
        return item.text;
    } else {
        var $service = $('<span> <img src="img/icons/service_{code}.svg"  class="landmarkIcon" /> {text}</span>'.format({
            code: item.element.value.replace('string:', ''),
            text: item.text
        }));
        return $service;
    }
}

function closeResultPanel(){
    if (SideNavi.isOpen()) {
        SideNavi.toggleIsVisible();
        SideNavi.slide();
    }
}

var currentTab;
function openIndicatorResultPanel() {
    var tab = $('.side-navi-item.item2');
    if (!SideNavi.isOpen()) {
        SideNavi.setEventParam(tab);
        SideNavi.slide();
        currentTab = tab;
    }
    if(currentTab.selector != ".side-navi-item.item2"){
        currentTab = tab;
        SideNavi.setEventParam(tab);
    }
}

function openSearchResultsPanel() {
    var tab = $('.side-navi-item.item1');
    if (!SideNavi.isOpen()) {
        SideNavi.setEventParam(tab);
        SideNavi.slide();
        currentTab = tab;
    }
    if(currentTab.selector != ".side-navi-item.item1"){
        currentTab = tab;
        SideNavi.setEventParam(tab);
    }
}

function isFunction(fnObj) {
    if (typeof fnObj === "function") {
        return true;
    } else {
        return false;
    }
}

Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

Object.stringGenerator = function (str, value) {
    var strArr = str.split('.');
    var obj = {};
    var i = 0;
    for (var i = 0; i < strArr.length; i++) {
        if (i == 0)
            obj[strArr[i]] = {};
        else
            obj[strArr[i - 1]][strArr[i]] = {};
    }
    if (value) {
        var length = strArr.length;
        if (strArr.length == 1) {
            obj[strArr[0]] = value;
        }
        else {
            obj[strArr[length - 2]][strArr[length - 1]] = value;
        }
    }
    return obj;
}

function setStringPathObjectValue(obj, strPath, value) {
    var o = Object.byString(obj, strPath);
    o = value;
}

function toRGBArray(strRGB) {
    var rgbArray;
    if (strRGB.indexOf('rgba') != -1) {
        rgbArray = strRGB.substring(5, strRGB.length - 1)
            .replace(/ /g, '')
            .split(',');
    } else {
        rgbArray = strRGB.substring(4, strRGB.length - 1)
            .replace(/ /g, '')
            .split(',');
    }
    rgbArray = _.map(rgbArray, function (strVal) {
        return parseFloat(strVal);
    });
    return rgbArray;
}


function calculateLineAngle(p1, p2){
    return Math.atan2(p2[0] - p1[0], p2[1] - p1[1]) * 180 / Math.PI;
}

function computeAngle(pointA, pointB){
    var dLon = (pointB[0] - pointA[0]) * Math.PI / 180;
    var lat1 = pointA[1] * Math.PI / 180;
    var lat2 = pointB[1] * Math.PI / 180;
    var y = Math.sin(dLon) * Math.cos(lat2);
    var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
    var bearing = Math.atan2(y, x)  * 180 / Math.PI;
    bearing = ((bearing + 360) % 360).toFixed(1); //Converting -ve to +ve (0-360)
    if(bearing >= 270)
      return parseFloat(bearing) - 270;
    else if(bearing >= 180)
      return bearing - 180;
    if(bearing > 90)
      return bearing - 90;
    else {
      return  bearing - 90;;
    }

    if(bearing >= 0 && bearing < 90){
        return 'N' + (bearing != 0  ? bearing + 'E' : '');
    }
    if(bearing >= 90 && bearing < 180){
        return (bearing != 90  ? 'S' + (180 - bearing).toFixed(1) : '') + 'E';
    }
    if(bearing >= 180 && bearing < 270){
        return 'S' + (bearing != 180  ? (bearing - 180).toFixed(1) + 'W' : '');
    }
    if(bearing >= 270){
        return (bearing != 270  ? 'N' + (360 - bearing).toFixed(1) : '') + 'W';
    }
    return 'N';
}

function detectBrowser(){
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName  = navigator.appName;
    var fullVersion  = ''+parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion,10);
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
    if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
     browserName = "Opera";
     fullVersion = nAgt.substring(verOffset+6);
     if ((verOffset=nAgt.indexOf("Version"))!=-1)
       fullVersion = nAgt.substring(verOffset+8);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
     browserName = "Microsoft Internet Explorer";
     fullVersion = nAgt.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
     browserName = "Chrome";
     fullVersion = nAgt.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
     browserName = "Safari";
     fullVersion = nAgt.substring(verOffset+7);
     if ((verOffset=nAgt.indexOf("Version"))!=-1)
       fullVersion = nAgt.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
     browserName = "Firefox";
     fullVersion = nAgt.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
              (verOffset=nAgt.lastIndexOf('/')) )
    {
     browserName = nAgt.substring(nameOffset,verOffset);
     fullVersion = nAgt.substring(verOffset+1);
     if (browserName.toLowerCase()==browserName.toUpperCase()) {
      browserName = navigator.appName;
     }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix=fullVersion.indexOf(";"))!=-1)
       fullVersion=fullVersion.substring(0,ix);
    if ((ix=fullVersion.indexOf(" "))!=-1)
       fullVersion=fullVersion.substring(0,ix);

    majorVersion = parseInt(''+fullVersion,10);
    if (isNaN(majorVersion)) {
     fullVersion  = ''+parseFloat(navigator.appVersion);
     majorVersion = parseInt(navigator.appVersion,10);
    }


    if(browserName === "Microsoft Internet Explorer"
        && majorVersion < 10){
       $('.browserSupport').toggle();
                   $(".browserNotify").html('(' + browserName + ' V' + majorVersion + ') is not supported '
                   + '<br> Please download Microsoft Internet Explorer V10+ '
                   + '<a href="https://www.microsoft.com/en-us/download/internet-explorer.aspx"><sub>download link</sub></a>');
    }
}
