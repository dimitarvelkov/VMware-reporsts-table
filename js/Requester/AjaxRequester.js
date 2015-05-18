var AjaxRequester= (function() {
    var headers = {
        "X-Parse-Application-Id": "NREXnlL0dRPKyqNV1yPMYDMFl2H7nuPndbbKICYY",
        "X-Parse-REST-API-Key": "bujGVnXbOWO9o1RFIsqJT2D5O47ESpSYA8L4ETji"
    }

    var url = "https://api.parse.com/1/";

    function makeRequest(method, url, data, success, error) {
        $.ajax({
            method: method,
            headers: headers,
            contentType: 'application/json',
            url: url,
            data: data,
            success: success,
            error: error
        })
    }

    function getRequest(seviceUrl, success, error) {
        var servurlUrl=url+"classes/"+seviceUrl;
        return makeRequest("GET", servurlUrl, null, success, error)
    }

    return {get: getRequest}
}());