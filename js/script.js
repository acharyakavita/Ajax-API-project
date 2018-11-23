
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
   
    var gMapsApiKey = '&key=AIzaSyBl4_ES114Sh6NXAYnNL5t9647xrRQCfr8';
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var gMapsUrlStub = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location='+ address+gMapsApiKey+'' ;

    $greeting.text('So, you want to live at ' + address + '?');

    $body.append('<img class="bgimg" src="'+gMapsUrlStub +'">');

    // load NY Times articles
    var nytBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=';
    var nytApiKey = '&api-key=f0f33f3526344777b33ab2d7eaf68fbe';
    var nytUrl = nytBaseUrl + cityStr + '&sort=newest' + nytApiKey;

    $.getJSON(nytUrl,function(data){
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        let articles=data.response.docs
        for(let item of articles){
            var articleLink = '<a href="' + item.web_url + '">' + item.headline.main + '</a>';
            var articleLead = '<p>' + item.snippet + '</p>';
            $nytElem.append('<li class="article">' + articleLink + articleLead + '</li>');
        }   
    }).error(function(e) {
        $nytElem.text( "New york times article could not be loaded" )
      })

    // Load Wikipedia articles
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='
                    + cityStr + '&format=json&callback=wikiCallback';

    // Set a timeout of 8 seconds to get the Wikipedia articles
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text('failed to get wikipedia resources');
    }, 8000);

    $.ajax({
        url:wikiUrl,
        dataType: 'jsonp',
        jsonp: "callback",
        success:(function(response) {
            var articleTitles = response[1];
            var articleUrls = response[3];
            for(let i=0;i<articleTitles.length;i++){
                $wikiElem.append('<li><a href="' + articleUrls[i] + '">' + articleTitles[i] + '</a></li>');
            }

            clearTimeout(wikiRequestTimeout);

        })
    });


    return false;
};

$('#form-container').submit(loadData);
