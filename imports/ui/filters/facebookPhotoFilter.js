const name = 'facebookPhotoFilter';

function FacebookPhotoFilter (fb_id) {


    if (! fb_id) return;

    let url = "https://graph.facebook.com/" + fb_id + "/picture?type=small";
    console.log("url=", url);
    return "https://graph.facebook.com/" + fb_id + "/picture?type=small";
  
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return FacebookPhotoFilter;
  });
