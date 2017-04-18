var handler = {
    submitMessage: function(){
        var form = document.querySelector('form');
        form.addEventListener('submit', function(){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    if (request.status == 4) {
                        console.log('result')
                    }
                }
            };
            
            var newsMedium = document.querySelector('select').value;
            var message = document.querySelector('input[type*="text"]').value;
            var importance = document.querySelector('input[name="color"]:checked').value;
            console.log(importance);
            request.open("GET", "/message?text=" + message + "&importance=" + importance + '&medium=' + newsMedium, true);
            request.send();
        });
    },
    selectMedium: function(){
        var select = document.querySelector('select');
        var input = document.querySelector('input[type*="text"]');

        select.addEventListener('change', function(){
            console.log('hi');
            if (select.value != 'no-medium') {
                input.setAttribute('disabled', true).setAttribute('required', false);
            } else {
                input.setAttribute('required', true).setAttribute('disabled', false);
            }
        });
    },
}