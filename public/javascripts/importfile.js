$(function() {
  $('input[type="submit"]').on('click', function(evt) {
    evt.preventDefault();
    var formData = new FormData();
    var file = document.getElementById('supplyFile').files[0];
    formData.append('supplyFile', file);
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('post', '/import', true);
    
    xhr.upload.addEventListener('loadend', function(e) {
      window.location.href = "/";
    });
        
    xhr.send(formData);        
    
  });
  
});