var handler = {
    submitMessage: function(){
        var form = document.querySelector('form');
        form.addEventListener('submit', function(){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == XMLHttpRequest.DONE) {
                    if (request.status == 200) {
                        console.log('result')
                    } else if (request.status == 400) {
                        console.log('There was an error 400');
                    } else {
                        console.log('something else other than 200 was returned');
                    }
                }
            };

            var message = document.querySelector('input[type*="text"]').value;
            var importance = document.querySelector('input[name="color"]:checked').value;
            console.log(importance);
            request.open("GET", "/message?text=" + message + "&importance=" + importance, true);
            request.send();
        });
    },
}