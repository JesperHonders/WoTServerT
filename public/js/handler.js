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

            var message = document.querySelector('input[type*="text"]').value;
            var importance = document.querySelector('input[name="color"]:checked').value;
            console.log(importance);
            request.open("GET", "/message?text=" + message + "&importance=" + importance, true);
            request.send();
        });
    },
}