var _start_pos = [52.372965, 4.893227];
var _start_zoom = 9;

var _init_pos = _start_pos;
var _init_zoom = _start_zoom;

var onsNavigator = document.getElementById('navigator');

var purpleIcon = L.icon({
    iconUrl: 'css/lib/leaflet/images/marker-icon-purple.png',
    iconRetinaUrl: "css/lib/leaflet/images/marker-icon-2x-purple.png",
    shadowUrl: 'css/lib/leaflet/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

// compile html list

(function () {
    data.listItems = new Array(data.Naam.length);
    for (var i = 0; i < data.Naam.length; i++) {
        var html = '<ons-list-item expandable>' + HtmlEncode(data.Naam[i]);
        html += '<div class="expandable-content">';
        html += HtmlEncode(data.postcode[i]) + ' ' + HtmlEncode(data.Woonplaats[i]) + ' (' + HtmlEncode(data.provincie[i]) + ')';
        html += '<small class="muted"><br><ons-icon icon="md-seat"></ons-icon> ' + data.Aantalstoelen[i] + ' stoelen';
        html += '<br><ons-icon icon="film"></ons-icon> ' + HtmlEncode(data.Aantaldoeken[i]) + ' doeken';
        html += '</small><br><br><a class="button button--material" href="tel:' + data.Telefoon[i] + '"><ons-icon icon="md-phone"></ons-icon> Bellen</a>';
        html += ' <a target="_system" class="button button--material" type="button" href="http://' + data.URL[i] + '"><ons-icon icon="md-link"></ons-icon> Website</a>';
        html += ' <ons-button modifier="material" onclick="fn.biosinfo(' + i + ')"><ons-icon icon="md-tag-more"></ons-icon> Info</ons-button>'
        html += '</div>';
        html += '</ons-list-item>';

        var div = document.createElement('div');
        div.innerHTML = html;

        data.listItems[i] = div.firstChild;
    }
})();

document.addEventListener('init', function (event) {
    var page = event.target;

    if (page.id === 'home-page') {
        var homePageList = document.getElementById('home-page-list');

        for (var i = 0; i < data.Naam.length; i++) {
            if (!homePageList.contains(data.listItems[i])) {
                homePageList.appendChild(data.listItems[i]);
            }
        }

        var provicieSelect = document.getElementById('choose-provincie');
        var searchInput = document.getElementById('search-bioscoop');

        searchInput.addEventListener('input', function (e) {
            var val = e.target.value.trim().toLowerCase();
            if (val.length < 2) {
                for (var i = 0; i < data.listItems.length; i++) data.listItems[i].setAttribute('data-search-filter', 'true');
            } else {
                for (var i = 0; i < data.listItems.length; i++) {
                    if (data.Naam[i].toLowerCase().indexOf(val) !== -1
                        || data.Woonplaats[i].toLowerCase().indexOf(val) !== -1
                        || data.gemeente[i].toLowerCase().indexOf(val) !== -1) {

                        data.listItems[i].setAttribute('data-search-filter', 'true');
                    } else data.listItems[i].setAttribute('data-search-filter', 'false');
                }
            }
        });

        provicieSelect.addEventListener('input', function (e) {
            var val = e.target.value;
            if (val === '*') {
                for (var i = 0; i < data.listItems.length; i++) data.listItems[i].setAttribute('data-provincie-filter', 'true');
            } else {
                for (var i = 0; i < data.listItems.length; i++) {
                    if (data.provincie[i] === val) {
                        data.listItems[i].setAttribute('data-provincie-filter', 'true');
                    } else data.listItems[i].setAttribute('data-provincie-filter', 'false');
                }
            }
        });
    }

    else if (page.id === 'detail-page') {
        var getDetailPageEl = function (name) { return page.getElementsByClassName('detail-page-' + name)[0] }

        var detailPageMapFab = getDetailPageEl('map-fab');
        detailPageMapFab.addEventListener('click', function(e) {
            var pos = [data.latitude[page.data.index], data.longitude[page.data.index]];
            onsNavigator.popPage();
            window.fn.loadMapLocation(pos);
        });

        var detailPageTitleToolbar = getDetailPageEl('title-toolbar');
        detailPageTitleToolbar.innerText = data.Naam[page.data.index];

        var detailPageTitle = getDetailPageEl('title');
        detailPageTitle.innerText = data.Naam[page.data.index];

        var detailPageLinkInfoFab = getDetailPageEl('url-fab');
        detailPageLinkInfoFab.href = 'http://' + data.URL[page.data.index];

        var detailPageLinkTelFab = getDetailPageEl('tel-fab');
        detailPageLinkTelFab.href = 'tel:' + data.Telefoon[page.data.index];

        var detailPageDoeken = getDetailPageEl('doeken');
        detailPageDoeken.innerText = data.Aantaldoeken[page.data.index];

        var detailPageSeats = getDetailPageEl('seats');
        detailPageSeats.innerText = data.Aantalstoelen[page.data.index];

        var detailPageAders = getDetailPageEl('adres');
        detailPageAders.innerHTML = data.Adres[page.data.index];
        detailPageAders.innerHTML += '<br>' + data.postcode[page.data.index] + ' ' + data.Woonplaats[page.data.index] + ' (' + data.provincie[page.data.index] + ')';

        var detailPageTel = getDetailPageEl('tel');
        detailPageTel.innerText = data.Telefoon[page.data.index];

        var detailPageUrl = getDetailPageEl('url');
        detailPageUrl.innerText = data.URL[page.data.index];

        var detailPageGemeente = getDetailPageEl('gemeente');
        detailPageGemeente.innerText = capitalizeFirstLetter(data.gemeente[page.data.index]);

        var detailPageWoonplaats = getDetailPageEl('woonplaats');
        detailPageWoonplaats.innerText = capitalizeFirstLetter(data.Woonplaats[page.data.index]);

        var detailPagePostcode = getDetailPageEl('postcode');
        detailPagePostcode.innerText = data.postcode[page.data.index];

        var detailPageStraat = getDetailPageEl('straat');
        detailPageStraat.innerText = data.Adres[page.data.index];
    }

    else if (page.id === 'map-page') {

        var map = L.map('map', {
            center: _init_pos,
            zoom: _init_zoom,
            zoomControl: false,
            minZoom: 7,
            maxZoom: 20
        });

        L.control.zoom({
            position: 'topright',
        }).addTo(map);
        L.tileLayer('maps/offline/{z}/{x}/{y}.png', {
            maxNativeZoom: 10,
            minNativeZoom: 9,
            maxZoom: 20,
            minZoom: 7,
            bounds: L.latLngBounds([
                [53.748711, 2.8125],
                [50.291094, 7.731628]
            ])
        }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            minZoom: 7,
            maxNativeZoom: 18,
            maxZoom: 20
        }).addTo(map);
        var marker = L.marker([0, 0], { icon: purpleIcon })
            .bindPopup('You', { autoPan: false })
            .addTo(map);
        marker.openPopup();
        var circle = L.circle([0, 0], 1).addTo(map);

        map.on('locationfound', onLocationFound);
        map.locate();

        function onLocationFound(e) {
            var radius = e.accuracy / 2;
            marker.setLatLng(e.latlng);
            circle.setLatLng(e.latlng);
            circle.setRadius(radius);
            marker._popup.setContent("You are within " + radius + " meters from this point")
        }

        function onLocationError() {
            console.warn('Unable to get location');
        }

        map.on('locationfound', onLocationFound);
        map.on('locationerror', onLocationError);

        // call locate every 3 seconds... forever
        setInterval(map.locate.bind(map), 3000);

        var markerArray = [];
        for (var i = 0; i < data.Naam.length; i++) {
            var marker = L.marker([data.latitude[i], data.longitude[i]], { icon: purpleIcon })
                .bindPopup(createContent(i), { autoPan: false })
            markerArray.push(marker);
        }
        var group = L.featureGroup(markerArray).addTo(map);
    }
});

document.addEventListener("deviceready", function () {
    if (cordova.platformId === 'browser') {
        document.body.appendChild(document.createElement('script')).src = './js/browser.js';
    } else {
        document.body.appendChild(document.createElement('script')).src = './js/admob.js';
    }
    if (navigator.onLine === false) {
        window.ons.notification.alert({
            message: _app_localization.noConnection[_app_userLang],
        });
    }
}, false);

window.ons.disableAutoStatusBarFill();

function createContent(i) {

    var str = data.Naam[i];
    str += '<br>' + data.Adres[i];
    str += '<br>' + data.postcode[i] + ' ' + data.Woonplaats[i] + ' (' + data.provincie[i] + ')';
    str += '<br><ons-button onclick="fn.biosinfo(' + i + ')">' + _app_localization.more[_app_userLang] + '</ons-button>'
    str += '<br><br><small style="color: #999;">';
    str += data.latitude[i].toString().slice(0, 9);
    str += ' ';
    str += data.longitude[i].toString().slice(0, 8);
    str += '</small>'
    return str;
}

window.fn = {};

window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.about = function () {
    onsNavigator.pushPage('views/about.html');
}

window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
        .then(menu.close.bind(menu));
};

window.fn.loadMap = function () {
    _init_pos = _start_pos;
    _init_zoom = _start_zoom;
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load('views/map.html')
        .then(menu.close.bind(menu));
};

window.fn.loadMapLocation = function (pos) {
    _init_pos = pos;
    _init_zoom = 14;
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load('views/map.html')
        .then(menu.close.bind(menu));
};

window.fn.biosinfo = function (i) {
    onsNavigator.pushPage('views/detail.html', {
        data: {
            index: i
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function HtmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}
