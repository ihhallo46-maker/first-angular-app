(function () {
    const path = "/scripts/oil/"
    const is_Mehrsprachig = false;
    if (!window.AS_OIL) {
      window.AS_OIL = {};
    }
    window.AS_OIL.CONFIG = {
        "publicPath": path,
        "config_version": 2,
        "locale_url": path+"oil.json",
        "timeout": 0,
        "iabVendorListUrl": path+"vendorslist.json",
        "show_limited_vendors_only": true,
        "advanced_settings": true,
        "advanced_settings_purposes_default": true,
        "mapText" : "test"
    }
    if (is_Mehrsprachig) {
            const langordner = "locales/"+document.documentElement.lang+"/"
            window.AS_OIL.CONFIG.locale_url = path+langordner+"oil.json";
            window.AS_OIL.CONFIG.iabVendorListUrl = path+langordner+"vendorslist.json";
            
    } 
}())

document.addEventListener('DOMContentLoaded', (event) => {
    if (document.getElementById("oil-container") == undefined){
    var div = document.createElement("div");
    div.id="oil-container";
    document.body.appendChild(div);
    };
    if (document.getElementsByClassName('googleMapView').length != 0){
        var source,
        script = document.createElement("script");
        script.type = "as-oil";
        script.async="";
        script.charset="";
        script.id = "managedMaps";
        script.setAttribute("data-managed", "as-oil");
        script.setAttribute("data-type", "text/javascript");
        script.setAttribute("data-purposes", "2");
        script.innerHTML="$('.googleMapView').productsMapView();"
        document.body.appendChild(script);
    }
      iframes = document.getElementsByTagName("iframe");
      for(var i = 0; i < iframes.length; i++) {
        if (iframes.item(i).hasAttribute("oil-src")){
          var id_name = 'oil_managed_iframe_'+i.toString()
          iframes.item(i).setAttribute('id', id_name)
          var source,
            script = document.createElement("script");
            script.type = "as-oil";
            script.async="";
            script.charset="";
            script.setAttribute("data-managed", "as-oil");
            script.setAttribute("data-type", "text/javascript");
            script.setAttribute("data-purposes", iframes.item(i).getAttribute('data-purposes'));
            script.innerHTML="var item = document.getElementById('"+id_name+"')\nvar src = item.getAttribute('oil-src')\nitem.setAttribute('src', src)"
            document.body.appendChild(script);
      }
    };
});

window.showOil = function() {         
    document.getElementById('oil-container').innerHTML = '<div id="oil-preference-center" class="as-oil light"></div>'
    window.AS_OIL.showPreferenceCenter();     
}
window.addEventListener('load', function() {
    $('.oilChange').each(function(i,o){o.onclick = window.showOil})
})


