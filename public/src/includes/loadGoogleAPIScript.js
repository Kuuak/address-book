// APP settings
import config from '../../../config';

// Helpers
import isNull from 'lodash.isnull';

const APIURL = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=';

function loadGoogleAPIScript( callbackname = null ) {

  if ( isNull(config.map.key) || window._googleApiLoaded ) {
    return;
  }

  let script_tag = document.createElement( 'script' );
  script_tag.setAttribute( 'type', 'text/javascript');
  script_tag.setAttribute( 'charset', 'utf-8');
  script_tag.setAttribute( 'src', `${APIURL}${config.map.key}`+ ( isNull(callbackname) ? '' : `&callback=${callbackname}` ) );

  (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);

  // Avoid loading twice the Script
  window._googleApiLoaded = true;
}
export default loadGoogleAPIScript;
